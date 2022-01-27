import socketIOClient from 'socket.io-client';

// const ENDPOINT = `wss://localhost:3000`;

// const io = socketIOClient();

export interface SocketHandlerConfig {
  onUpdate?: () => void;
}

class SocketHandler extends EventTarget {
	ready = false;
	connected = false;
	io = socketIOClient();
  onUpdate: () => void;


	constructor(config: SocketHandlerConfig) {
		super();
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
