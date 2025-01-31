import os from "os";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import logUpdate from "log-update";

import { ComputeSocket } from "./services/compute/ComputeSocket";
import SeedSolver from "./services/seedSolverHandler.node";

const argv = require("yargs/yargs")(process.argv.slice(2))
  .env("NOITOOL")
  .option("url", {
    default: "https://www.noitool.com",
  })
  .option("cores", {
    default: 0,
  })
  .option("userId", {})
  .option("exit", {
    default: false,
  })
  .option("minRunTime", {
    default: 0,
  }).argv;

var SegfaultHandler = require("segfault-handler");
SegfaultHandler.registerHandler("crash.log");

console.log(`Noitool console search ${process.env.npm_package_version}`, argv, os.cpus().length);

// const seedSolver = new SeedSolver(1, false);
const seedSolver = new SeedSolver(argv.cores || os.cpus().length, false);

const initTime = new Date().getTime();

const exitHandler = () => {
  setTimeout(() => {
    process.exit(0);
  }, 5000);
};

const newComputeSocket = new ComputeSocket({
  url: argv.url || "https://www.noitool.com/",
  version: process.env.npm_package_version || "0.0.0",
  sessionToken: argv.sessionToken,
  seedSolver: seedSolver as any,
  onUpdate: () => {
    if (!newComputeSocket.jobName) {
      return;
    }
    logUpdate(
      JSON.stringify(
        {
          connected: newComputeSocket.connected,
          running: newComputeSocket.running,
          info: {
            jobName: newComputeSocket.jobName,
            chunkTo: newComputeSocket.chunkTo,
            chunkFrom: newComputeSocket.chunkFrom,
          },
        },
        null,
        2,
      ),
    );
  },
  onDone: () => {
    if (!argv.exit) {
      return;
    }

    if (argv.minRunTime) {
      const timeRunning = new Date().getTime() - initTime;
      if (timeRunning < argv.minRunTime) {
        return;
      }
    }

    console.log("Done!");
    newComputeSocket.terminate();
    exitHandler();
  },
});

newComputeSocket.on("compute:version_mismatch", () => {
  console.log("Version mismatch. Please update your client.");
  newComputeSocket.terminate();
  exitHandler();
});

newComputeSocket.on("compute:unauthorized", config => {
  console.log("userID or sessionToken is invalid");
  console.log("Used config:");
  console.log(config);
  newComputeSocket.terminate();
  exitHandler();
});

newComputeSocket.start().catch(e => {
  console.error(e);
  newComputeSocket.terminate();
  exitHandler();
});

let terminations = 0;

process.on("SIGINT", () => {
  if (terminations > 0) {
    process.exit(1);
  }
  terminations++;
  newComputeSocket.terminate();
  exitHandler();
});
process.on("SIGTERM", () => {
  if (terminations > 0) {
    process.exit(1);
  }
  terminations++;
  newComputeSocket.terminate();
  exitHandler();
});
