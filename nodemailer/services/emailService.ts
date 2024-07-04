import config from "../config/config";
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
			from: {
				name: "MyCareer",
				address: config.email.user,
			},
			bcc: "AfricaRice-HRTrainee1@cgiar.org," + recipients.join(","),
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
