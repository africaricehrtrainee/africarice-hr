// Import necessary modules and dependencies
import express, { Request, Response, NextFunction } from "express";
import passport from "passport";

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
	"/login/saml",
	passport.authenticate("saml", {
		failureRedirect: "/",
		failureFlash: true,
	})
);

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
