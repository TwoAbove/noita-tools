import socketIOClient from 'socket.io-client';

// const ENDPOINT = `wss://localhost:3000`;

// const io = socketIOClient();

export interface SocketHandlerConfig {}

class SocketHandler extends EventTarget {
	ready = false;
	connected = false;
	io = socketIOClient();

	constructor(config: SocketHandlerConfig) {
		super();
		this.configIO();
	}

	async waitForConnection() {
		return new Promise<void>(res => {
			res();
		});
	}

	configIO(): void {
		this.io.on('connect', () => {
			this.ready = true;
			this.connected = true;
		});
		this.io.on('connect', () => {
			this.ready = true;
			this.connected = true;
		});

		this.io.on('disconnect', reason => {
			console.log('disconnected: ', reason);
			this.connected = false;
		});
	}

	on(e: string, cb): void {
		this.io.on(e, cb);
	}
}

export default SocketHandler;
