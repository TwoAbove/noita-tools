import { BaseComputeProvider } from "./BaseComputeProvider";
import { ChunkProvider, Status } from "./ChunkProvider";
import { ILogicRules } from "../../services/SeedInfo/infoHandler/IRule";
import { SeedSolver } from "../seedSolverHandler";

export class CallbackComputeHandler extends BaseComputeProvider {
  constructor(
    public onUpdate: (status: Status) => void,
    public chunkProvider: ChunkProvider,
    public rules: ILogicRules,
    public seedSolver: SeedSolver,
  ) {
    super(onUpdate, chunkProvider, rules);
  }

  async start() {
    if (this.running) {
      return;
    }
    this.running = true;
    while (this.running) {
      const chunk = this.chunkProvider.getNextChunk(this.seedSolver.workerList.length);
      if (!chunk) {
        this.running = false;
        return;
      }
      const results = await this.seedSolver.searchChunk(chunk.from, chunk.to, this.rules);
      this.chunkProvider.commitChunk(chunk.chunkId, results);
      this.onUpdate(this.getStatus());
    }
  }

  destruct() {
    this.stop();
  }
}
