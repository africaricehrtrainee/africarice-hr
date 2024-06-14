import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import config from "../config/config";
import hbs from "nodemailer-express-handlebars";
import transporter from "../utils/emailTransporter";

export const sendEmail = async (
	recipients: string[],
	subject: string,
	templateData:
		| { template: "main"; context: { content: string } }
		| { template: "recovery"; context: { recoveryId: number } }
) => {
	try {
		const options = {
			from: config.email.user,
			cc: recipients.join(","),
			bcc: "AfricaRice-HRTrainee1@cgiar.org",
			subject: subject ?? "Update from MyCareer",
			template: templateData.template,
			context: {
				...templateData.context,
				address: process.env.PUBLIC_ADDRESS,
			},
		};
		return await transporter.sendMail(options);
	} catch (error) {
		console.error(error);
	}
};
