// Import necessary modules and dependencies
import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import prisma from "../../prisma/middleware";
import sendMail from "../services/mail-service";
import { Employees } from "@prisma/client";

// Create an Express router
const router = express.Router();

// Route for user login
router.post(
	"/login",
	passport.authenticate("local"), // Use Passport middleware for local authentication
	(req: Request, res: Response, next: NextFunction) => {
		if (req.user) {
			// If authentication succeeds, log in the user
			req.logIn(req.user, function (error) {
				if (error) return next(error);
				res.json({ message: "Login successful", user: req.user });
			});
		} else {
			// If authentication fails, send an error response
			res.status(401).json("An error occurred when logging in");
		}
	}
);

router.get(
	"/callback",
	bodyParser.urlencoded({ extended: false }),
	passport.authenticate("saml", {
		failureRedirect: "/",
		failureFlash: true,
	}),
	function (req, res) {
		res.redirect("/");
	}
);

router.get("/saml", passport.authenticate("saml"));

// Route to change password
router.put("/password-change", function (req, res) {
	try {
		if (req.user) {
			const user = req.user as Employees;
			const { password, newPassword } = req.body;

			if (!password || !newPassword) {
				return res
					.status(400)
					.json("Please include valid credentials.");
			}
			if (password !== (user.password as string)) {
				return res.status(400).json("Your old password is incorrect.");
			}

			prisma.employees
				.update({
					where: {
						employeeId: user.employeeId,
					},
					data: {
						password: newPassword,
					},
				})
				.then(() => {
					return res
						.status(201)
						.json("Successfully changed password.");
				})
				.catch(() => {
					return res
						.status(500)
						.json("An error occurred when changing passwords.");
				});
		} else if (req.body.recoveryId) {
			const { recoveryId, newPassword } = req.body;

			if (!recoveryId || !newPassword) {
				return res
					.status(400)
					.json("Please include valid credentials.");
			}

			prisma.accountRecoveries
				.findUnique({
					where: {
						recoveryId,
					},
				})
				.then((recovery) => {
					if (!recovery) {
						return res
							.status(404)
							.json("This recovery link is invalid.");
					}

					prisma.employees
						.update({
							where: {
								employeeId: recovery.employeeId,
							},
							data: {
								password: newPassword,
							},
						})
						.then(() => {
							return res
								.status(201)
								.json("Successfully changed password.");
						})
						.catch(() => {
							return res
								.status(500)
								.json(
									"An error occurred when changing passwords."
								);
						});
				});
		} else {
			return res.status(400).json("Unauthorized");
		}
	} catch (error) {
		return res.status(500).json("An internal error occurred.");
	}
});

// Route to check user session
router.get("/session", (req: Request, res: Response) => {
	if (req.isAuthenticated()) {
		// If user is authenticated, return user information
		res.json(req.user);
	} else {
		// If user is not authenticated, send an unauthorized response
		res.status(401).json("Unauthorized");
	}
});

router.post("/recovery", async function (req, res) {
	const { email } = req.body;

	if (!email)
		return res.status(400).json("Please include an e-mail address.");

	const user = await prisma.employees.findUnique({
		where: {
			email,
		},
	});

	if (!user) return res.status(404).json("This account does not exist.");

	const recovery = await prisma.accountRecoveries.create({
		data: {
			employeeId: user.employeeId,
		},
	});

	if (!recovery)
		return res.status(500).json("Your account could not be recovered.");

	if (recovery.used) {
		return res
			.status(400)
			.json("This recovery link has already been used.");
	}

	sendMail({
		subject: "Account recovery",
		recipients: [user.email],
		templateData: {
			template: "recovery",
			context: {
				recoveryId: recovery.recoveryId,
			},
		},
	})
		.then((value) => {
			return res
				.status(201)
				.json("Your recovery link has successfully been sent.");
		})
		.catch((value) => {
			return res
				.status(500)
				.json("An error occured while sending your recovery link.");
		});
});

// Route for user logout
router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
	req.logout((err: any) => {
		if (err) return next(err);
		res.status(201).json("Successfully logged out.");
	});
});

// Route to access user profile (protected route)
router.get("/profile", isAuthenticated, (req: Request, res: Response) => {
	// This route is protected and only accessible to authenticated users
	res.json({ message: "Profile page", user: req.user });
});

// Middleware function to check if the user is authenticated
export function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	try {
		if (req.isAuthenticated()) {
			// If the user is authenticated, call the next middleware
			return next();
		}

		// If the user is not authenticated, send an unauthorized response
		res.status(401).json({ message: "Unauthorized" });
	} catch (err) {
		console.log(err);
		res.status(500).json("Internal Server Error");
	}
}

// Export the router for use in other parts of the application
export default router;
