// Import necessary modules and dependencies
import passportLocal, { Strategy } from "passport-local";
import { DbService } from "./db-service";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define a custom LocalStrategy class that extends Passport's Strategy
export class LocalStrategy extends Strategy {
	// Constructor for the LocalStrategy class
	constructor() {
		// Call the constructor of Passport's Strategy class
		super(
			{ usernameField: "email", passwordField: "password" },
			async (email, password, done) => {
				try {
					// Check if email or password is missing
					if (!email || !password) {
						return done(null, false, {
							message: "Please provide credentials",
						});
					}

					// Query the database to find a user with the given email (while ensuring they are not deleted)
					const user = await prisma.employees.findUnique({
						where: { email: email },
						include: {
							subordinates: true,
						},
					});

					// If no user is found, return an error
					if (!user) {
						return done(null, false, {
							message: "This account does not exist.",
						});
					}

					// Compare the provided password with the hashed password stored in the database
					const res = await bcrypt.compare(password, user.password);

					// If the password doesn't match, return an error
					if (!res) {
						return done(null, false, {
							message: "Invalid password",
						});
					}

					// If authentication is successful, return the user object
					return done(null, user);
				} catch (error) {
					// Handle any errors that occur during authentication
					return done(error);
				}
			}
		);
	}
}
