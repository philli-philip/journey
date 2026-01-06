import db from "src/db/db";
import { AsyncTask, CronJob } from "toad-scheduler";

const imageCleanUp = new AsyncTask("simple task", async () => {
  console.log("start image clean up. Deleting old images.");
  try {
    const info = db
      .prepare(
        "DELETE FROM images WHERE (unixepoch(CURRENT_TIMESTAMP) - unixepoch(deletedAt)) > ?"
      )
      .run(60 * 60 * 24 * 90);
    console.log(`Deleted ${info.changes} items.`);
  } catch (err: any) {
    console.log(`Error while cleaning up files: ${err.message}`);
  }
  console.log("Image clean complete.");
});

export const ImageCleanUpCron = new CronJob(
  {
    cronExpression: "* * * * *", // Every day
  },
  imageCleanUp
);
