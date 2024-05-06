import { Request, Response, Router } from "express";
import prisma from "../../prisma/middleware";
import { Settings } from "../global";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const settings = await prisma.settings.findMany({});

		const settingsObject = settings.reduce((acc, setting) => {
			// @ts-ignore
			acc[setting.name] = setting.value;
			return acc;
		}, {});

		res.json(settingsObject);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.put("/", async (req: Request, res: Response) => {
	const settingsObject: Settings = req.body;
	try {
		const settings = Object.entries(settingsObject).map(([name, value]) => {
			return prisma.settings.update({
				where: {
					name: name,
				},
				data: {
					value: value,
				},
			});
		});

		prisma.$transaction(settings);

		res.json({ message: "Settings updated" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
