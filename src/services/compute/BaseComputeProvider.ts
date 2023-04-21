import { ILogicRules } from '../SeedInfo/infoHandler/IRule';
import { Status, ChunkProvider } from './ChunkProvider';

export class BaseComputeProvider {
	running = false;
	numberOfWorkers = 0;

	constructor(
		public onUpdate: (status: Status) => void,
		public chunkProvider: ChunkProvider,
		public rules: ILogicRules
	) {}

	start() {
		this.running = true;
		this.onUpdate(this.getStatus());
	}

	stop() {
		this.running = false;
		this.onUpdate(this.getStatus());
	}

	getStatus(): Status {
		return {
			running: this.running,
			checked: this.chunkProvider.progress,
			results: [...this.chunkProvider.results.values()] || [],
			estimate: this.chunkProvider.eta.estimate(),
			rate: this.chunkProvider.eta.rate(),
			currentChunk: this.chunkProvider.config.searchFrom
		};
	}
}
