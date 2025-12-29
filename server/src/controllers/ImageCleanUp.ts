import db from "src/db";
import { AsyncTask, CronJob } from "toad-scheduler";

const imageCleanUp = new AsyncTask("simple task", async (taskId) => {
  console.log("start image clean up. Deleting old images.");
  db.run(
    "DELETE FROM images WHERE (unixepoch(CURRENT_TIMESTAMP) - unixepoch(deletedAt)) > ?",
    ["60 * 60 * 24 * 90"],
    function (this, err) {
      if (err) {
        console.log(`Error hile cleaning up files: ${err.message}`);
        return;
      }
      console.log(`Deleted ${this.changes} items.`);
    }
  );
  console.log("Image clean complete.");
});

export const ImageCleanUpCron = new CronJob(
  {
    cronExpression: "* * * * *", // Every day
  },
  imageCleanUp
);
