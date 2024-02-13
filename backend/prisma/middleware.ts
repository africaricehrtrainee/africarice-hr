import { Objectives, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Objective middlewares to log
prisma.$use(async (params, next) => {
    return next(params);
});

export default prisma;
