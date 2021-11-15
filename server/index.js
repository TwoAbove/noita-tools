const handler = require('serve-handler');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3001;
// const sequelize = new Sequelize(process.env.SEQUELIZE_STRING);

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json())

app.post('/data', (req, res) => {
	console.log(req.body);
	res.send(200);
});

app.use((req, res) =>
	handler(req, res, {
		public: './build',
		rewrites: [
			{ source: '/', destination: '/index.html' }
			// { source: '/', destination: '/index.html' }
		]
	})
);

const server = app.listen(PORT, () => {
	console.log(`Running at http://localhost:${PORT}`);
});

const io = socketIO(server);

const randomText = length => {
	let chars = '0123456789';
	let str = '';
	for (let i = 0; i < length; i++) {
		str += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return str;
};

const rooms = new Set();

const roomLength = 6;
const getRoomNumber = () => {
	if (rooms.size > Math.pow(10, roomLength)) {
		console.error('Rooms full');
		return;
	}
	let finalNumber;
	while (!finalNumber) {
		const tryNumber = randomText(roomLength);
		if (!rooms[tryNumber]) {
			finalNumber = tryNumber;
		}
	}
	return finalNumber;
};

io.on('connection', socket => {
	let roomNumber;

	socket.on('get_room', () => {
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

});

io.of('/').adapter.on('delete-room', room => {
	// Room is empty
	rooms.delete(room);
});
