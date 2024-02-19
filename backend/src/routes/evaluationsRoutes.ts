// src/routes/commentRoutes.ts
import express from "express";
import { DbService } from "./../services/db-service";
import { isAuthenticated } from "./authRoutes";
import { ObjectiveComments } from "@prisma/client";
import { parse } from "dotenv";
import prisma from "../../prisma/middleware";

const router = express.Router();
const db = new DbService();

router.get("/", isAuthenticated, async (req, res) => {
    try {
        const result = await prisma.evaluations.findMany({});
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/", isAuthenticated, async (req, res) => {
    try {
        const { evaluation } = req.body;

        if (!evaluation) {
            res.status(400).json({ error: "Evaluation is required" });
            return;
        }

        const result = await prisma.evaluations.upsert({
            where: {
                evaluationId: evaluation.evaluationId
                    ? evaluation.evaluationId
                    : -1,
            },
            create: evaluation,
            update: evaluation,
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

        const result = await prisma.evaluations.findUnique({
            where: { evaluationId: parseInt(id) },
        });

        if (!result) {
            res.status(404).json({ error: "Evaluation not found" });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { evaluation } = req.body;

        if (!evaluation) {
            res.status(400).json({ error: "Evaluation is required" });
            return;
        }

        const result = await prisma.evaluations.update({
            where: { evaluationId: parseInt(id) },
            data: evaluation,
        });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await prisma.evaluations.delete({
            where: { evaluationId: parseInt(id) },
        });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
