import path from "path";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { ExpressHandlebars } from "express-handlebars";
import {
    SMTP_ADDRESS,
    SMTP_EMAIL,
    SMTP_PASSWORD,
    SMTP_PORT,
} from "../../../../config";

const transporter = nodemailer.createTransport({
    host: SMTP_ADDRESS,
    port: SMTP_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
    },
});

transporter.use(
    "compile",
    hbs({
        viewEngine: {
            extname: ".hbs",
            partialsDir: path.resolve("./src/services/mail/views/"),
            defaultLayout: false,
        },
        viewPath: path.resolve("./src/services/mail/views"),
        extName: ".hbs",
    })
);

export default transporter;
