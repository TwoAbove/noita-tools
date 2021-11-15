import socketIOClient from 'socket.io-client';

// const ENDPOINT = `wss://localhost:3000`;

// const io = socketIOClient();

export interface SocketHandlerConfig {}

class SocketHandler extends EventTarget {
	ready = false;
	io = socketIOClient();

	constructor(config: SocketHandlerConfig) {
		super();

		this.ready = true;

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
		});
	}

	on(e: string, cb): void {
		this.io.on(e, cb);
	}
}

export default SocketHandler;
