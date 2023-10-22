import { schedule } from "node-cron";

import { Job } from "../db.mjs";

const tasks = {};

const handleJobs = async () => {
  const logs = [];
  logs.push("Running jobs");

  const now = new Date();

  const jobs = await Job.find({ runAt: { $lte: now }, status: "pending" });

  logs.push(`Found jobs: ${jobs.length}`);

  for (const job of jobs) {
    logs.push(`Running job: ${job._id}, ${job.type}`);
    job.status = "running";
    job.updatedAt = new Date();
    await job.save();

    try {
      const task = tasks[job.type];
      if (!task) {
        throw new Error(`No task found for job type: ${job.type}`);
      }
      const result = tasks[job.type](job.data);
      job.result = result;
      job.status = "success";
    } catch (e) {
      logs.push(e);
      job.result = e;
      job.status = "failed";
    }

    job.updatedAt = new Date();
    await job.save();
    logs.push(`Finished job: ${job._id}, ${job.type}`);
  }

  logs.push("Finished jobs");

  console.log(logs.join("\n"));
};

// Run every minute
schedule("* * * * *", handleJobs);
