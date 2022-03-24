const handler = require('serve-handler');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const cron = require('node-cron');
const B2 = require('backblaze-b2');
B2.prototype.uploadAny = require('@gideo-llc/backblaze-b2-upload-any');

const PORT = process.env.PORT || 3001;

const b2 = new B2({
	applicationKeyId: process.env.B2_APP_KEY_ID,
	applicationKey: process.env.B2_APP_KEY
});

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

let data = [];
let stats = [];

app.post('/data', (req, res) => {
	data.push(req.body);
	res.send(200);
});

app.post('/stats', (req, res) => {
	stats.push(req.body);
	res.send(200);
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
