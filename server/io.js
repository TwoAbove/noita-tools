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

const corsDomains = [
	'dev.noitool.com',
	'noitool.com',
	'localhost:3000',
	'localhost:3001'
];
const corsSchemes = ['http://', 'https://', 'ws://', 'wss://', ''];
const allowedCORS = corsSchemes.flatMap(ext => corsDomains.map(d => ext + d));

const { getRoomNumber, rooms } = require('./rooms');

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

const handleConnection = (socket, io) => {
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

	socket.on('compute:need_job', async (appetite, cb) => {
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
		host.emit('compute:get_job', appetite, data => {
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
};

const makeIO = server => {
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

	io.on('connection', socket => {
		handleConnection(socket, io);
	});

	io.of('/').adapter.on('delete-room', room => {
		// Room is empty
		rooms.delete(room);
	});
};

module.exports = makeIO;
