import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

var uwIdpCert = fs.readFileSync("../certs/saml.pem", "utf-8");

export default {
	rabbitmqUrl: process.env.RABBITMQ_URL as string,
	publicApi: process.env.PUBLIC_ADDRESS as string,
	saml: {
		entryPoint: process.env.SAML_ENTRY_POINT as string,
		issuer: "passport-saml" as string,
		idpCert: uwIdpCert,
		callbackUrl: process.env.SAML_CALLBACK_URL as string,
	},
};
