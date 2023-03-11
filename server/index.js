require('dotenv-flow').config();
const handler = require('serve-handler');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { Server: SocketIOServer } = require('socket.io');
const cron = require('node-cron');
const multer = require('multer');

const B2 = require('backblaze-b2');
const { randomUUID } = require('crypto');
B2.prototype.uploadAny = require('@gideo-llc/backblaze-b2-upload-any');

const PORT = process.env.PORT || 3001;

const hasB2 = process.env.B2_APP_KEY_ID && process.env.B2_APP_KEY;

const b2 = new B2({
	applicationKeyId: process.env.B2_APP_KEY_ID,
	applicationKey: process.env.B2_APP_KEY
});

const rooms = new Set();

const roomLength = 4;
const chars = '1234';
const getRoomNumber = () => {
	if (rooms.size > Math.pow(10, roomLength)) {
		console.error('Rooms full');
		return;
	}
	let finalNumber;
	while (!finalNumber) {
		const tryNumber = randomText(chars, roomLength);
		if (!rooms[tryNumber]) {
			finalNumber = tryNumber;
		}
	}
	return finalNumber;
};

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

let data = [];
let stats = [];

app.post('/api/data', (req, res) => {
	data.push(req.body);
	res.sendStatus(200);
});

app.post('/api/stats', (req, res) => {
	stats.push(req.body);
	res.sendStatus(200);
});

const dbs = {};

app.get('/api/db_dump/:id', (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) {
		return res.sendStatus(400);
	}
	res.status(200).send(dbs[id]);
	delete dbs[id];
});

const m = multer();

app.post('/api/db_dump/', m.any(), (req, res) => {
	const id = getRoomNumber();
	dbs[id] = req.files[0].buffer;
	res.send({ id });
	setTimeout(() => {
		delete dbs[id];
	}, 900000); // 15 minutes
});

let r;
const authorize = async () => {
	r = await b2.authorize();
};

if (hasB2) {
	authorize();
	setInterval(authorize, 1000 * 60 * 60 * 23); // 23h
}

app.post('/api/db_debug/', m.any(), async (req, res) => {
	const id = randomUUID();
	res.send({ id });
	try {
		await b2.uploadAny({
			bucketId: 'e3081aa3bc7d39b38a1d0615',
			fileName: `${id}.db`,
			partSize: r.data.recommendedPartSize,
			data: req.files[0].buffer
		});
	} catch (e) {
		console.error(e);
	}
});

app.get('/m/*', async (req, res) => {
	const m = req.params[0];
	console.log(m);
	res.append('Cache-Control', 'public, immutable, max-age=604800');
	res.send({});
});

app.use((req, res) =>
	handler(req, res, {
		public: './build',
		rewrites: [{ source: '/', destination: '/index.html' }],
		headers: [
			{
				source: 'static/**',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, immutable, max-age=604800'
					}
				]
			}
		]
	})
);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Server error');
});

const server = app.listen(PORT, () => {
	console.log(`Running at http://localhost:${PORT}`);
});

const corsDomains = ['dev.noitool.com', 'noitool.com', 'localhost:3000'];
const corsSchemes =  ['http://', 'https://', 'ws://', 'wss://', ''];
const allowedCORS = corsSchemes.flatMap(
	ext => corsDomains.map(d => ext + d)
);

const io = new SocketIOServer(server, {
	cors: {
		origin: function(origin, callback) {
			if (allowedCORS.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		}
	}
});

// hosts in room
const hostMap = new Map();

const setHost = (roomId, id) => {
	let room = hostMap.get(roomId);
	if (!room) {
		room = [id];
	} else {
		room.push(id);
	}
	hostMap.set(roomId, room);
};

const getHost = roomId => {
	let room = hostMap.get(roomId);
	if (!room) {
		return;
	}
	return room[Math.floor(Math.random() * room.length)];
};

const removeHost = (roomId, id) => {
	let room = hostMap.get(roomId);
	if (!room) {
		return;
	}
	let newRoom = room.filter(r => r !== id);
	hostMap.set(roomId, newRoom);
};

const randomText = (chars, length) => {
	let str = '';
	for (let i = 0; i < length; i++) {
		str += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return str;
};

io.on('connection', socket => {
	let roomNumber;

	socket.on('host', (customRoom, cb) => {
		roomNumber = customRoom || getRoomNumber();
		rooms.add(roomNumber);
		socket.join(roomNumber);
		setHost(roomNumber, socket.id);
		socket.emit('set_room', roomNumber);

		// cb('ok');
	});

	socket.on('compute:workers', async cb => {
		const s = (await io.in(roomNumber).fetchSockets()).filter(Boolean);
		cb(s.length - 1);
	});

	socket.on('compute:need_job', async cb => {
		const hostSocketId = getHost(roomNumber);
		if (!hostSocketId) {
			cb();
			return;
		}
		// Hack - there should be a better way to handle these;
		const host = io.sockets.sockets.get(hostSocketId);
		if (!host) {
			return;
		}
		host.emit('compute:get_job', data => {
			data.hostId = hostSocketId;
			cb(data);
		});
	});

	socket.on('compute:done', ({ hostId, result, chunkId }) => {
		const host = io.sockets.sockets.get(hostId);
		if (!host) {
			return;
		}
		host.emit('compute:done', { result, chunkId });
	});

	socket.on('join', (room, cb) => {
		socket.join(room);
		roomNumber = room;
		cb('ok');
	});

	// Not safe. In the future, we should check that this is sent by the host
	// Maybe issue a token when generating a room?
	socket.on('seed', seed => {
		socket.to(roomNumber).emit('seed', seed);
	});

	socket.on('restart', () => {
		socket.to(roomNumber).emit('restart', '');
	});

	socket.on('disconnect', () => {
		removeHost(roomNumber, socket.id);
	});
});

io.of('/').adapter.on('delete-room', room => {
	// Room is empty
	rooms.delete(room);
});

const upload = async () => {
	if (!hasB2) {
		return;
	}
	try {
		await b2.uploadAny({
			bucketId: '93c80a630c6d59a37add0615',
			fileName: `${new Date().toISOString()}.json`,
			partSize: r.data.recommendedPartSize,
			data: Buffer.from(JSON.stringify({ data, stats }))
		});
		data = [];
		stats = [];
	} catch (e) {
		console.error(e);
	}
};

cron.schedule('0 0 * * *', upload);

const shutdown = signal => err => {
	if (err) console.error(err.stack || err);
	setTimeout(() => {
		console.error('Waited 10s, exiting non-gracefully');
		process.exit(1);
	}, 10000).unref();
	Promise.allSettled([upload(), new Promise(res => server.close(res))]).then(
		() => {
			console.log('Gracefully shut down');
			process.exit(0);
		}
	);
};

process.on('SIGTERM', shutdown('SIGTERM')).on('SIGINT', shutdown('SIGINT'));

process.on('uncaughtException', shutdown('SIGINT'));
