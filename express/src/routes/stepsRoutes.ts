import express from "express";
import { DbService } from "../services/db-service";
import { isAuthenticated } from "./authRoutes";
import prisma from "../../prisma/middleware";
const dbService = new DbService();

const router = express.Router();

// Endpoint to get all steps
router.get("/", async (req, res) => {
    try {
        const result = await prisma.steps.findMany({
            orderBy: {
                stepId: "asc",
            },
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send("Error retrieving the steps");
    }
});

// Endpoint to set the current step
// PUT - Update an objective
router.put("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { step } = req.body;
    try {
        const result = await prisma.steps.update({
            where: { stepId: parseInt(id) },
            data: step,
        });

        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating the step");
    }
});

router.put("/:id/current", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        // Set all steps to false except the one that is being updated
        prisma.steps
            .updateMany({
                where: { stepId: { not: parseInt(id) } },
                data: { active: false },
            })
            .then(() => {
                prisma.steps
                    .update({
                        where: { stepId: parseInt(id) },
                        data: { active: true },
                    })
                    .then((result) => {
                        res.status(200).send(result);
                    });
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating the step");
    }
});

export default router;
