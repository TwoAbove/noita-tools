import SocketHandler, {
	SocketHandlerConfig
} from '../../../services/SocketHandler';

class SeedLinkHandler extends SocketHandler {
	hostRoom?: string;
	room?: string;
	seed?: string;

	constructor(config: SocketHandlerConfig) {
		super(config);

		this.io.on('set_room', (hostRoom: string) => {
			this.hostRoom = hostRoom;
			this.joinRoom(this.hostRoom);
			this.dispatchEvent(new Event('update'));
		});
		this.io.on('seed', (seed: string) => {
			this.seed = seed;
			this.dispatchEvent(new Event('update'));
		});
	}

	sendSeed(seed: string) {
		this.io.emit('seed', seed);
	}

	async getRoom() {
		this.io.emit('get_room');
	}

	async joinRoom(room) {
		return new Promise<void>(res => {
			this.io.emit('join', room, status => {
				this.room = room;
				this.dispatchEvent(new Event('update'));
				res();
			});
		});
	}
}

export default SeedLinkHandler;
