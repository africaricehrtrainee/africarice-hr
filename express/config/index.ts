import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export default {
	rabbitmqUrl: process.env.RABBITMQ_URL as string,
	publicApi: process.env.PUBLIC_ADDRESS as string,
	saml: {
		entryPoint: process.env.SAML_ENTRY_POINT as string,
		issuer: "africarice-mycareer" as string,
		idpCert: process.env.SAML_CERT as string,
		callbackUrl: process.env.SAML_CALLBACK_URL as string,
	},
};
