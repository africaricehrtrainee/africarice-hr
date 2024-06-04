import cron from "node-cron";
import chalk from "chalk";
import { lightFormat } from "date-fns";
import sendMail from "../services/mail-service";
// Schedule the task to run every 5 seconds (using a cron expression)

export default async function cronJobInit() {
	const log = console.log;

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
			subject: "Test Mail",
			recipients: ["k.sams@cgiar.org"],
			templateData: {
				template: "main",
				context: { content: "This is a test mail." },
			},
		});
	}

	// Every 30 minutes run the mail test job using cron
	cron.schedule("*/30 * * * *", mailTestJob);
}
