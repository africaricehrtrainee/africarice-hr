import { sendEmail } from "../services/emailService";

interface EmailMessage {
	recipients: string[];
	subject: string;
	templateData:
		| { template: "main"; context: { content: string } }
		| { template: "recovery"; context: { recoveryId: number } };
	isTestEmail: boolean;
}

export const handleEmailMessage = async (msg: Buffer) => {
	try {
		const message: EmailMessage = JSON.parse(msg.toString());
		return await sendEmail(
			message.recipients,
			message.subject,
			message.templateData,
			message.isTestEmail
		);
	} catch (error) {
		console.error(error);
	}
};
