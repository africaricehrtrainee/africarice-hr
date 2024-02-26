import { compareAsc, compareDesc } from "date-fns";
import prisma from "../../../prisma/middleware";
import {
    StaffObjectiveStatus,
    StaffSelfEvaluationStatus,
    Status,
    SupervisorEvaluationStatus,
    SupervisorObjectiveStatus,
    SupervisorStatus,
} from "./../../global.d";

export function keygen(): string {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";

    let password = "";
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
}

export async function computeNotifications(
    employeeId: number
): Promise<Status> {
    let objectiveStatus: StaffObjectiveStatus = "OBJECTIVE_IDLE";
    let selfEvaluationStatus: StaffSelfEvaluationStatus =
        "SELF_EVALUATION_IDLE";
    let supervisorStatus: SupervisorStatus = [];

    const employee = await prisma.employees.findUnique({
        where: {
            employeeId,
        },
    });

    if (!employee) {
        throw new Error("Employee not found");
    }

    const steps = await prisma.steps.findMany({ orderBy: { stepId: "asc" } });

    const objectives = await prisma.objectives.findMany({
        where: {
            employeeId,
        },
    });

    const evaluation = await prisma.evaluations.findFirst({
        where: {
            employeeId,
            evaluationYear: new Date().getFullYear().toString(),
        },
    });

    const team = await prisma.employees.findMany({
        where: {
            supervisorId: employeeId,
        },
    });

    // Objective status computation

    // Objective submission period has started
    if (compareAsc(new Date(), steps[0].dateFrom) !== -1) {
        // Objective is not between 3 and 5 inclusive or aren't all sent
        if (
            objectives.length < 3 ||
            objectives.length > 5 ||
            objectives.some((obj) => obj.status == "draft")
        ) {
            objectiveStatus = "OBJECTIVE_EMPTY";
        }
        // Objective is between 3 and 5 inclusive and all are sent
        else if (objectives.every((obj) => obj.status == "sent")) {
            objectiveStatus = "OBJECTIVE_SENT";
        }
        // Some objectives are invalid
        else if (objectives.some((obj) => obj.status == "invalid")) {
            objectiveStatus = "OBJECTIVE_INVALID";

            // All objectives are ok
        } else if (objectives.every((obj) => obj.status == "ok")) {
            objectiveStatus = "OBJECTIVE_OK";

            // Self-evaluation period is there
            if (compareAsc(new Date(), steps[1].dateFrom) !== -1) {
                // Some objectives are unrated
                if (objectives.some((obj) => obj.selfComment == null)) {
                    objectiveStatus = "OBJECTIVE_UNRATED";
                }
                // All objectives are rated
                else {
                    objectiveStatus = "OBJECTIVE_RATED";
                }
            }
        }
    } else {
        objectiveStatus = "OBJECTIVE_IDLE";
    }

    // Self-evaluation status computation
    if (compareAsc(new Date(), steps[3].dateFrom) !== -1) {
        if (!evaluation || evaluation.selfEvaluationStatus == "draft") {
            selfEvaluationStatus = "SELF_EVALUATION_EMPTY";
        } else if (evaluation.selfEvaluationStatus == "sent") {
            selfEvaluationStatus = "SELF_EVALUATION_SENT";
        }
    } else {
        selfEvaluationStatus = "SELF_EVALUATION_IDLE";
    }

    // Supervisor status computation

    team.map(async (member) => {
        let objectiveStatus: SupervisorObjectiveStatus =
            "SUPERVISOR_OBJECTIVE_IDLE";
        let evaluationStatus: SupervisorEvaluationStatus =
            "SUPERVISOR_EVALUATION_IDLE";

        const objectives = await prisma.objectives.findMany({
            where: {
                employeeId: member.employeeId,
            },
        });

        const evaluation = await prisma.evaluations.findFirst({
            where: {
                employeeId: member.employeeId,
                evaluationYear: new Date().getFullYear().toString(),
            },
        });

        if (compareAsc(new Date(), steps[1].dateFrom) !== -1) {
            if (objectives.some((obj) => obj.status == "sent")) {
                objectiveStatus = "SUPERVISOR_OBJECTIVE_UNREVIEWED";
            } else {
                objectiveStatus = "SUPERVISOR_OBJECTIVE_REVIEWED";
            }
        }

        if (compareAsc(new Date(), steps[4].dateFrom) !== -1) {
            if (evaluation && evaluation.evaluationStatus == "sent") {
                evaluationStatus = "SUPERVISOR_EVALUATION_RATED";
            } else {
                evaluationStatus = "SUPERVISOR_EVALUATION_UNRATED";
            }
        }

        return {
            objectiveStatus,
            evaluationStatus,
            employeeId: member.employeeId,
        };
    });
    return {
        objectiveStatus,
        selfEvaluationStatus,
        supervisorStatus,
    };
}
