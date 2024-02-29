// src/routes/commentRoutes.ts
import express from "express";
import { DbService } from "./../services/db-service";
import { isAuthenticated } from "./authRoutes";
import { ObjectiveComments, Objectives } from "@prisma/client";
import { parse } from "dotenv";
import prisma from "../../prisma/middleware";

const router = express.Router();
const db = new DbService();

router.get("/", isAuthenticated, async (req, res) => {
    try {
        const result = await prisma.objectives.findMany({
            orderBy: { objectiveId: "asc" },
        });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/", isAuthenticated, async (req, res) => {
    try {
        const { objective }: { objective: Objectives } = req.body;

        if (!objective) {
            res.status(400).json({ error: "Please provide an Objective" });
            return;
        }

        const result = await prisma.objectives.create({
            data: objective,
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await prisma.objectives.findUnique({
            where: { objectiveId: parseInt(id) },
        });

        if (!result) {
            res.status(404).json({ error: "Objective not found" });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/bulk", isAuthenticated, async (req, res) => {
    try {
        const { objectives } = req.body;

        if (!objectives) {
            res.status(400).json({ error: "Objective array is required" });
            return;
        }

        const result = await prisma.$transaction(
            objectives.map((objective: Objectives) => {
                return prisma.objectives.upsert({
                    where: { objectiveId: objective.objectiveId },
                    update: objective,
                    create: objective,
                });
            })
        );

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { objective } = req.body;

        if (!objective) {
            res.status(400).json({ error: "Objective is required" });
            return;
        }

        const result = await prisma.objectives.update({
            where: { objectiveId: parseInt(id) },
            data: objective,
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/:id/update", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { objective } = req.body;

        if (!objective) {
            res.status(400).json({ error: "Objective is required" });
            return;
        }

        const obj = await prisma.objectives.findUnique({
            where: { objectiveId: parseInt(id) },
        });

        if (
            !obj ||
            !obj.deadline ||
            !obj.description ||
            !obj.title ||
            !obj.kpi ||
            !obj.successConditions ||
            obj.status != "ok"
        ) {
            res.status(404).json({ error: "Objective not found or invalid" });
            return;
        }

        const result = await prisma.$transaction([
            prisma.objectives.update({
                where: { objectiveId: parseInt(id) },
                data: objective,
            }),
            prisma.objectiveHistory.create({
                data: {
                    objectiveId: parseInt(id),
                    deadline: obj.deadline,
                    description: obj.description,
                    title: obj.title,
                    kpi: obj.kpi,
                    successConditions: obj.successConditions,
                },
            }),
        ]);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const obj = await prisma.objectives.findUnique({
            where: { objectiveId: parseInt(id) },
        });

        if (!obj) {
            res.status(404).json({ error: "Objective not found" });
            return;
        }

        if (obj.status == "ok") {
            const result = await prisma.objectives.update({
                where: { objectiveId: parseInt(id) },
                data: { status: "cancelled" },
            });

            res.status(201).json(result);
        } else {
            const result = await prisma.objectives.delete({
                where: { objectiveId: parseInt(id) },
            });
            res.status(201).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
