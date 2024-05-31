import cron from "node-cron";
import chalk from "chalk";
import sendMail, {
	mailEvaluationStep,
	mailNotificationStep,
} from "../../services/mail-service";
import { lightFormat } from "date-fns";
// Schedule the task to run every 5 seconds (using a cron expression)

export default async function cronJobInit() {
	const log = console.log;
	// Define your task function here
	function evaluationStepJob() {
		log(
			chalk.black.bgGreenBright(
				`Running evaluation schedule job at ${lightFormat(
					new Date(),
					"hh:mm:ss"
				)}`
			)
		);
		mailEvaluationStep();
		// Replace this with your actual task logic
	}

	function evaluationAlertJob() {
		log(
			chalk.black.bgGreenBright(
				`Running evaluation alert job at ${lightFormat(
					new Date(),
					"hh:mm:ss"
				)}`
			)
		);
		mailNotificationStep();
	}

	function mailTestJob() {
		log(
			chalk.black.bgGreenBright(
				`Running mail test job at ${lightFormat(
					new Date(),
					"hh:mm:ss"
				)}`
			)
		);
		sendMail({
			title: "Test Mail",
			recipients: ["k.sams@cgiar.org"],
			context: { content: "This is a test mail." },
		});
	}

	// Every 30 minutes run the mail test job using cron
	cron.schedule("*/30 * * * *", mailTestJob);
}
