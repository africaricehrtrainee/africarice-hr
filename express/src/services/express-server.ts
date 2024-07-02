// Import necessary modules and dependencies
import express, { Application } from "express";
import session from "express-session";
import passport from "passport";
import { LocalStrategy } from "./auth-service";

import employeesRoutes from "../routes/employeesRoutes";
import commentsRoutes from "../routes/commentsRoutes";
import evaluationsRoutes from "../routes/evaluationsRoutes";
import evaluation360Routes from "../routes/evaluation360Routes";
import evaluator360Routes from "../routes/evaluator360Routes";
import objectivesRoutes from "../routes/objectivesRoutes";
import authRoutes from "../routes/authRoutes";
import stepsRoutes from "../routes/stepsRoutes";
import reportsRoutes from "../routes/reportsRoutes";
import settingsRoutes from "../routes/settingsRoutes";

import morgan from "morgan";
import cors from "cors";
import { DbService } from "./db-service";
import employeeDatabaseInit from "./xlsx-service";
import prisma from "../../prisma/middleware";
import prismaInit from "../../prisma/startup";
import cronJobInit from "../util/cron";
import { Strategy } from "@node-saml/passport-saml";
import config from "../../config";

export class ExpressServer {
	private app: Application;
	private PORT: number;
	private dbService: DbService;

	constructor(port: number) {
		// Create an Express application
		this.app = express();
		this.PORT = port;

		// Initialize the DbService for database interactions
		this.dbService = new DbService();
		// Configure middleware and routes
		this.configureMiddleware();
		this.configureRoutes();
	}

	private configureMiddleware(): void {
		// Use middleware for request logging (Morgan)
		this.app.use(morgan("common"));

		// Enable JSON request body parsing
		this.app.use(express.json());

		// Enable URL-encoded request body parsing
		this.app.use(express.urlencoded({ extended: true }));

		// this.app.use(
		// 	cors({
		// 		origin: "*",
		// 	})
		// );
		var whitelist = [
			"http://localhost",
			"http://localhost:3000",
			"https://10.225.100.33",
			"https://login.microsoftonline.com",
			"https://mycareer.africarice.org",
			process.env.PUBLIC_ADDRESS,
		];

		// Configure CORS (Cross-Origin Resource Sharing)
		this.app.use(
			cors({
				credentials: true,
				origin: function (origin, callback) {
					console.log("Origin is", origin);
					if (!origin || whitelist.indexOf(origin) !== -1) {
						callback(null, true);
					} else {
						callback(new Error("Not allowed by CORS"));
					}
				},
			})
		);

		// this.app.use(function (req, res, next) {
		// 	res.header("Access-Control-Allow-Origin", "*");
		// 	res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
		// 	res.header(
		// 		"Access-Control-Allow-Headers",
		// 		"Origin, X-Requested-With, Content-Type, Accept"
		// 	);
		// 	next();
		// });
		//  Configure session management with Express session
		this.app.use(
			session({
				secret: "@rc1999_secret", // Secret key for session management
				resave: false,
				saveUninitialized: false,
				cookie: { maxAge: 3600000, secure: false }, // Session cookie settings
			})
		);

		// Initialize and configure Passport.js for authentication
		this.app.use(passport.initialize());
		this.app.use(passport.session());

		// Use a custom LocalStrategy for Passport.js authentication
		passport.use(new LocalStrategy());

		passport.use(
			"saml",
			new Strategy(
				{
					callbackUrl: config.saml.callbackUrl,
					idpCert: config.saml.idpCert,
					issuer: config.saml.issuer,
					entryPoint: config.saml.entryPoint,
					passReqToCallback: true,
					authnContext: [
						"http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows",
					],
					identifierFormat: null,
				},
				function (req, profile, done) {
					console.log(profile);
					try {
						if (!profile)
							return done(new Error("No profile found"));
						prisma.employees
							.findFirst({
								where: {
									email: profile.email,
								},
							})
							.then((employee) => {
								if (employee) {
									return done(null, employee);
								} else {
									return done(new Error("No account found"));
								}
							});
					} catch (error) {
						console.log(error);
					}
				},
				function (req, profile, done) {
					try {
						if (!profile) {
							return done(new Error("No profile found"));
						}
						done(null, profile);
					} catch (error) {}
				}
			)
		);
		// Serialize and deserialize user data for session management
		passport.serializeUser((employee: any, done) =>
			done(null, employee.employeeId)
		);
		passport.deserializeUser(async (id: number, done) => {
			try {
				const result = await prisma.employees.findUnique({
					where: { employeeId: id },
					include: {
						supervisor: true,
						subordinates: true,
					},
				});

				if (!result) {
					done(null, false);
				} else {
					done(null, result);
				}
			} catch (err) {
				done(err);
			}
		});
	}

	private configureRoutes(): void {
		// Define and use various API routes
		this.app.use("/api/employees", employeesRoutes);
		this.app.use("/api/comments", commentsRoutes);
		this.app.use("/api/evaluations", evaluationsRoutes);
		this.app.use("/api/evaluation360", evaluation360Routes);
		this.app.use("/api/evaluator360", evaluator360Routes);
		this.app.use("/api/objectives", objectivesRoutes);
		this.app.use("/api/steps", stepsRoutes);
		this.app.use("/api/reports", reportsRoutes);
		this.app.use("/api/settings", settingsRoutes);
		this.app.use("/api/auth", authRoutes);
	}

	public start(): void {
		// Start the Express application and listen on the specified port
		try {
			this.app.listen(this.PORT, () => {
				console.log(
					`API server is running on http://localhost:${this.PORT}`
				);

				cronJobInit();
				employeeDatabaseInit();
				prismaInit();
			});
		} catch (error) {
			console.log(error);
		}
	}
}
function findByEmail(email: any, arg1: (err: any, user: any) => any) {
	throw new Error("Function not implemented.");
}
