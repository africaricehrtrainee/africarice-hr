import cron from "node-cron";
import chalk from "chalk";
import sendMail, {
    mailEvaluationStep,
    mailNotificationStep,
} from "../../services/mail-service";
import { lightFormat } from "date-fns";

export default async function cronJob() {
    const log = console.log;
    // Define your task function here
    function evaluationDayJob() {
        console.log("Checking for the current evaluation step.");
        mailEvaluationStep();
        // Replace this with your actual task logic
    }

    function evaluationAlertJob() {
        log(
            chalk.black
                .bgYellow`\u03BB Running evaluation alert job at ${lightFormat(
                new Date(),
                "mm:ss:SS"
            )}`
        );
        mailNotificationStep();
    }

    // Schedule the task to run every 5 seconds (using a cron expression)
    // cron.schedule("0 0 * * *", evaluationDayJob);
    // cron.schedule("* * * * *", evaluationDayJob);

    log(
        chalk.black.bgYellow(
            "\u03BB Alert service is scheduled to run every minute"
        )
    );
    // Alternatively, you can use a more human-readable syntax (recommended)
    // cron.schedule('*/5 * * * *', myTask);
}
