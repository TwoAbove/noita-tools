import socketIOClient, { Socket } from 'socket.io-client';

// const ENDPOINT = `wss://localhost:3000`;

// const io = socketIOClient();

export interface SocketHandlerConfig {
	url?: string;

	onUpdate?: () => void;
}

class SocketHandler extends EventTarget {
	ready = false;
	connected = false;

	io: Socket;

	onUpdate: () => void;

	constructor(config: SocketHandlerConfig) {
		super();
		this.io = socketIOClient(config.url as any);
		if (
			config.onUpdate
		) {
			this.onUpdate = config.onUpdate;
		} else {
			this.onUpdate = () => { };
		}
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
			this.onUpdate();
		});

		this.io.on('disconnect', reason => {
			console.log('disconnected: ', reason);
			this.connected = false;
			this.onUpdate();
		});
	}

	on(e: string, cb): void {
		this.io.on(e, cb);
	}
}

export default SocketHandler;
