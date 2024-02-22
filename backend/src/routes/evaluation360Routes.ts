import { Router } from "express";
import { Evaluation360 } from "@prisma/client";
import prisma from "../../prisma/middleware";
const router = Router();

// Get all evaluation360s
router.get("/", async (req, res) => {
    try {
        const evaluation360s = await prisma.evaluation360.findMany();
        res.json(evaluation360s);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a single evaluation360 by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const evaluation360 = await prisma.evaluation360.findUnique({
            where: { evaluation360Id: parseInt(id) },
        });
        if (evaluation360) {
            res.json(evaluation360);
        } else {
            res.status(404).json({ error: "Evaluation360 not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a single evaluation360 by ID
router.get("/:id/evaluators", async (req, res) => {
    const { id } = req.params;
    try {
        const evaluators360 = await prisma.evaluator360.findMany({
            where: { evaluationId: parseInt(id) },
        });
        res.json(evaluators360);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new evaluation360
router.post("/", async (req, res) => {
    const { evaluation }: { evaluation: Evaluation360 } = req.body;
    try {
        const evaluation360 = await prisma.evaluation360.create({
            data: {
                employeeId: evaluation.employeeId,
                supervisorId: evaluation.supervisorId,
            },
        });
        res.status(201).json(evaluation360);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update an evaluation360
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { evaluation } = req.body;
    try {
        const evaluation360 = await prisma.evaluation360.update({
            where: { evaluation360Id: parseInt(id) },
            data: evaluation,
        });
        res.json(evaluation360);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
