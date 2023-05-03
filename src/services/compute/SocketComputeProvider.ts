import { BaseComputeProvider } from './BaseComputeProvider';
import { ChunkProvider, Status } from './ChunkProvider';
import { ILogicRules } from '../SeedInfo/infoHandler/IRule';
import { ComputeSocket } from './ComputeSocket';

export class SocketComputeProvider extends BaseComputeProvider {
	constructor(
		public onUpdate: (status: Status) => void,
		public chunkProvider: ChunkProvider,
		public rules: ILogicRules,
		public socket: ComputeSocket
	) {
		super(onUpdate, chunkProvider, rules);
	}

	destruct = () => {
		this.stop();
	};

	start = () => {
		this.socket.running = true;
		this.socket.register();
		this.socket.io.on('compute:get_job', this.handleJob);
		this.socket.io.on('compute:done', this.handleResults);
		super.start();
	};

	stop = () => {
		this.socket.running = false;
		this.socket.unregister();
		this.socket.io.off('compute:get_job', this.handleJob);
		this.socket.io.off('compute:done', this.handleResults);
		super.stop();
	};

	handleJob = (appetite: number, cb) => {
		const chunk = this.chunkProvider.getNextChunk(appetite);
		if (!chunk) {
			cb({ done: true });
			this.stop();
			return;
		}

		const data = {
			rules: this.rules,
			to: chunk.to,
			from: chunk.from,
			chunkId: chunk.chunkId,
			jobName: this.chunkProvider.config.jobName,
			stats: this.getStatus()
		};
		cb(data);
	};

	handleResults = ({ result, chunkId }) => {
		this.chunkProvider.commitChunk(chunkId, result);
		this.onUpdate(this.getStatus());
	};
}
