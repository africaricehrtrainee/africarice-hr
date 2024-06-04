import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import config from "../config/config";
import hbs from "nodemailer-express-handlebars";

const transporter = nodemailer.createTransport({
	host: config.email.host,
	port: config.email.port,
	secure: false,
	auth: {
		user: config.email.user,
		pass: config.email.pass,
	},
});

transporter.use(
	"compile",
	hbs({
		viewEngine: {
			extname: ".hbs",
			partialsDir: path.resolve(__dirname, "../../templates"),
			defaultLayout: false,
		},
		viewPath: path.resolve(__dirname, "../../templates"),
		extName: ".hbs",
	})
);

export default transporter;
