import { Router } from "express";
import { Evaluator360 } from "@prisma/client";
import prisma from "../../prisma/middleware";
const router = Router();

// Get all evaluator360s
router.get("/", async (req, res) => {
	try {
		const evaluator360s = await prisma.evaluator360.findMany();
		res.json(evaluator360s);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get a single evaluator360 by ID
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const evaluator360 = await prisma.evaluator360.findUnique({
			where: { evaluator360Id: parseInt(id) },
		});
		if (evaluator360) {
			res.json(evaluator360);
		} else {
			res.status(404).json({ error: "evaluator360 not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Create a new evaluator360
router.post("/", async (req, res) => {
	const { evaluation }: { evaluation: Evaluator360 } = req.body;
	try {
		const evaluator360 = await prisma.evaluator360.create({
			data: evaluation,
		});
		res.status(201).json(evaluator360);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update an evaluator360
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { evaluator } = req.body;
	try {
		const evaluator360 = await prisma.evaluator360.update({
			where: { evaluator360Id: parseInt(id) },
			data: {
				...evaluator,
			},
		});
		res.json(evaluator360);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update an evaluator360
router.post("/bulk", async (req, res) => {
	const { evaluators } = req.body;
	try {
		if (!Array.isArray(evaluators)) {
			res.status(400).json({ error: "Invalid input" });
			return;
		}
		console.log(evaluators);
		const result = await prisma.$transaction(
			evaluators.map((evaluator: Evaluator360) =>
				prisma.evaluator360.update({
					where: { evaluator360Id: evaluator.evaluator360Id },
					data: {
						...evaluator,
					},
				})
			)
		);

		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update an evaluator360
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const evaluator360 = await prisma.evaluator360.delete({
			where: { evaluator360Id: parseInt(id) },
		});
		res.json(evaluator360);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
