import { Objectives, PrismaClient } from "@prisma/client";
import { computeNotifications } from "../src/routes/util/utils";

const prisma = new PrismaClient();

// Objective middlewares to log
prisma.$use(async (params, next) => {
    // Personal Objective Trigger
    if (params.model === "Objectives" && params.action === "update") {
        console.log("1");
        const id = params.args.data.employeeId as number;
        const prevStatus = await computeNotifications(id);
        if (prevStatus) {
            const result = await next(params);
            console.log("2");
            const curStatus = await computeNotifications(id);
            // Find the difference in status
            if (prevStatus.objectiveStatus !== curStatus.objectiveStatus) {
                console.log("There is a change in the status of the objective");
            }
        }
    } else {
        return next(params);
    }
});

export default prisma;
