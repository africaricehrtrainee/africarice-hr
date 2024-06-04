import dotenv from "dotenv";

dotenv.config();

export default {
	rabbitmqUrl: process.env.RABBITMQ_URL as string,
	publicApi: process.env.PUBLIC_ADDRESS as string,
};
