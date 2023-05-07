import os from "os";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ComputeSocket } from "./services/compute/ComputeSocket";
import SeedSolver from "./services/seedSolverHandler.node";

const argv = yargs(hideBin(process.argv)).argv as any;

var SegfaultHandler = require("segfault-handler");
SegfaultHandler.registerHandler("crash.log");

console.log(argv, os.cpus().length);

// const seedSolver = new SeedSolver(1, false);
const seedSolver = new SeedSolver(argv.cores || os.cpus().length, false);

const newComputeSocket = new ComputeSocket({
  url: argv.computeUrl || "https://www.noitool.com/",
  version: process.env.npm_package_version || "0.0.0",
  sessionToken: argv.sessionToken,
  userId: argv.userId,
  seedSolver: seedSolver as any,
  onUpdate: () => {
    if (!newComputeSocket.jobName) {
      return;
    }
    console.log({
      connected: newComputeSocket.connected,
      running: newComputeSocket.running,
      info: {
        jobName: newComputeSocket.jobName,
        chunkTo: newComputeSocket.chunkTo,
        chunkFrom: newComputeSocket.chunkFrom,
      },
    });
  },
  onDone: () => {
    if (argv.exit) {
      console.log("Done!");
      newComputeSocket.stop();
      process.exit(0);
    }
  },
});

newComputeSocket.on("compute:version_mismatch", () => {
  console.log("Version mismatch. Please update your client.");
  newComputeSocket.stop();
});

newComputeSocket.start().catch(e => {
  console.error(e);
  newComputeSocket.stop();
});
