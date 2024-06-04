import { sendEmail } from "../services/emailService";

interface EmailMessage {
	recipients: string[];
	subject: string;
	templateData:
		| { template: "main"; context: { content: string } }
		| { template: "recovery"; context: { recoveryId: number } };
}

export const handleEmailMessage = async (msg: Buffer) => {
	try {
		const message: EmailMessage = JSON.parse(msg.toString());
		return await sendEmail(
			message.recipients,
			message.subject,
			message.templateData
		);
	} catch (error) {
		console.error(error);
	}
};
