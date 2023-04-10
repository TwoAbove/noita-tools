import os from 'os';

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { ComputeSocket } from './services/compute/ComputeSocket';
import SeedSolver from './services/seedSolverHandler.node';

const argv = yargs(hideBin(process.argv)).argv as any;

var SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler("crash.log");

console.log(argv);

// const seedSolver = new SeedSolver(1, false);
const seedSolver = new SeedSolver(argv.cores || os.cpus().length, false);

const newComputeSocket = new ComputeSocket({
	url: argv.computeUrl || 'https://dev.noitool.com/',
	computeId: argv.computeId,
	seedSolver: seedSolver as any,
	onUpdate: () => {
		console.log({
			connected: newComputeSocket.connected,
			running: newComputeSocket.running,
			info: {
				jobName: newComputeSocket.jobName,
				chunkTo: newComputeSocket.chunkTo,
				chunkFrom: newComputeSocket.chunkFrom,
			}
		});
	}
});

newComputeSocket.start().catch(e => {
	console.error(e);
	newComputeSocket.stop();
});
