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
import morgan from "morgan";
import cors from "cors";
import { DbService } from "./db-service";
import init from "./xlsx-service";
import prisma from "../../prisma/middleware";

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
        this.app.use(morgan("dev"));

        // Enable JSON request body parsing
        this.app.use(express.json());

        // Enable URL-encoded request body parsing
        this.app.use(express.urlencoded({ extended: true }));

        // Configure CORS (Cross-Origin Resource Sharing)
        this.app.use(
            cors({
                origin: "*", // Specify the allowed origin for CORS
                credentials: true,
            })
        );

        // Configure session management with Express session
        this.app.use(
            session({
                secret: "your-secret-key", // Secret key for session management
                resave: false,
                saveUninitialized: false,
                cookie: { maxAge: 3600000, secure: false }, // Session cookie settings
            })
        );

        // Initialize and configure Passport.js for authentication
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // Use a custom LocalStrategy for Passport.js authentication
        passport.use(new LocalStrategy(this.dbService));

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
        this.app.use("/api/auth", authRoutes);
    }

    public start(): void {
        // Start the Express application and listen on the specified port
        this.app.listen(this.PORT, () => {
            console.log(
                `API server is running on http://localhost:${this.PORT}`
            );
            prisma.employees
                .create({
                    data: {
                        email: "admin@mail.com",
                        firstName: "Admin",
                        lastName: "Platform",
                        jobTitle: "Administrator",
                        password: "admin",
                        role: "admin",
                        employeeId: 99,
                    },
                })
                .catch((err) => {});

            // cronJob();
        });
    }
}
