// src/routes/commentRoutes.ts
import express from "express";
import { DbService } from "./../services/db-service";
import { isAuthenticated } from "./authRoutes";
import { ObjectiveComments } from "@prisma/client";
import prisma from "../../prisma/middleware";

const router = express.Router();
const db = new DbService();

router.get("/", isAuthenticated, async (req, res) => {
    try {
        const result = await prisma.objectiveComments.findMany({});

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/", isAuthenticated, async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            res.status(400).json({ error: "Comment is required" });
            return;
        }

        const result = await prisma.objectiveComments.create({
            data: comment,
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
