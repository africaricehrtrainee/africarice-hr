import dotenv from "dotenv";

dotenv.config();

export default {
	rabbitmqUrl: process.env.RABBITMQ_URL as string,
	publicApi: process.env.PUBLIC_ADDRESS as string,
	oauthClientSecret: "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",
	oauthClientId:
		"979161779144-0tpt0jib18l1vv1p1odlo7b8u8obq7tf.apps.googleusercontent.com",
};
