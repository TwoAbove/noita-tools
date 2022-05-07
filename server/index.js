const handler = require('serve-handler');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const cron = require('node-cron');
const multer = require('multer');

const B2 = require('backblaze-b2');
B2.prototype.uploadAny = require('@gideo-llc/backblaze-b2-upload-any');

const PORT = process.env.PORT || 3001;

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
app.use(bodyParser.urlencoded({
	extended: true
}));

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

const m = multer()

app.post('/api/db_dump/', m.any(), (req, res) => {
	const id = getRoomNumber();
	dbs[id] = req.files[0].buffer;
	res.send({ id });
	setTimeout(() => {
		delete dbs[id];
	}, 900000); // 15 minutes
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
})

const server = app.listen(PORT, () => {
	console.log(`Running at http://localhost:${PORT}`);
});

const io = socketIO(server);

const randomText = (chars, length) => {
	let str = '';
	for (let i = 0; i < length; i++) {
		str += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return str;
};

io.on('connection', socket => {
	let roomNumber;

	socket.on('host', () => {
		const rn = getRoomNumber();
		if (rn) {
			rooms.add(rn);
			roomNumber = rn;
			socket.emit('set_room', roomNumber);
			socket.join(roomNumber);
		}
	});

	socket.on('join', (room, cb) => {
		if (room) {
			socket.join(room);
			cb('ok');
		}
	});

	// Not safe. In the future, we should check that this is sent by the host
	// Maybe issue a token when generating a room?
	socket.on('seed', seed => {
		socket.to(roomNumber).emit('seed', seed);
	});

	socket.on('restart', () => {
		socket.to(roomNumber).emit('restart', '');
	});
});

io.of('/').adapter.on('delete-room', room => {
	// Room is empty
	rooms.delete(room);
});

const upload = async () => {
	try {
		const r = await b2.authorize(); // must authorize first (authorization lasts 24 hrs)
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
	Promise.all([upload(), new Promise(res => server.close(res))]).then(() => {
		console.log('Gracefully shut down');
		process.exit(0);
	});
};

process.on('SIGTERM', shutdown('SIGTERM')).on('SIGINT', shutdown('SIGINT'));

process.on('uncaughtException', shutdown('SIGINT'));
