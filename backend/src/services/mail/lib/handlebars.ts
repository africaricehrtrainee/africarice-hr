import path from "path";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { ExpressHandlebars } from "express-handlebars";

const transporter = nodemailer.createTransport({
    host: "cluster5out.us.messagelabs.com",
    port: 25,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "AfricaRicehhr@cgiar.org",
        pass: "P@ss2020Rh#",
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
