import cron from "node-cron";
import sendMail, { mailEvaluationStep } from "../../services/mail-service";

export default function cronJob() {
    // Define your task function here
    function evaluationJob() {
        console.log();
        console.log("EVALUATION CRON JOB--------");
        mailEvaluationStep();
        // Replace this with your actual task logic
    }

    // Schedule the task to run every 5 seconds (using a cron expression)
    cron.schedule("*/30 * * * * *", evaluationJob);

    // Alternatively, you can use a more human-readable syntax (recommended)
    // cron.schedule('*/5 * * * *', myTask);

    console.log("Mailing service is scheduled to run every 30 seconds");
}
