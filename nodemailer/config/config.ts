import dotenv from "dotenv";

dotenv.config();

export default {
	rabbitmqUrl: process.env.RABBITMQ_URL as string,
	production: process.env.NODE_ENV === "production",
	email: {
		host: process.env.SMTP_ADDRESS as string,
		port: parseInt(process.env.SMTP_PORT as string),
		user: process.env.SMTP_EMAIL as string,
		pass: process.env.SMTP_PASSWORD as string,
	},
};
