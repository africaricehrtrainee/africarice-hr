import { Objectives, PrismaClient } from "@prisma/client";
import { computeNotifications } from "../src/routes/util/utils";

const prisma = new PrismaClient();

// Objective middlewares to log
prisma.$use(async (params, next) => {
    // Personal Objective Trigger
    return await next(params);
});

export default prisma;
