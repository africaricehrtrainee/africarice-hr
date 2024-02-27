import emailjs from "@emailjs/nodejs";
import { DbService } from "./db-service";
import { compareAsc } from "date-fns";
import { Employees, Prisma, PrismaClient } from "@prisma/client";
import { computeNotifications } from "../routes/util/utils";
import chalk from "chalk";

const prisma = new PrismaClient();
export default function sendMail({
    title,
    content,
    recipients,
}: {
    title: string;
    content: string;
    recipients: string;
}) {}

export async function mailEvaluationStep() {
    const employees = await prisma.employees.findMany({
        select: {
            employeeId: true,
            email: true,
            firstName: true,
            lastName: true,
        },
        orderBy: {
            lastName: "asc",
        },
    });

    if (!employees) {
        console.log("No employees have been found.");
        return;
    }

    const getCurrentDate = (): string => new Date().toISOString().split("T")[0];
    const date = getCurrentDate();

    // Fetching all the steps
    const step = await prisma.steps.findFirst({
        select: {
            dateFrom: true,
            name: true,
            message: true,
            stepId: true,
            sent: true,
        },
        where: {
            dateFrom: {
                lte: date,
            },
        },
        orderBy: {
            dateFrom: "desc",
        },
    });

    if (!step) {
        console.log("No performance step has been found");
        return;
    }

    console.log("Current evaluation step is: " + `\u001b${step.name}`);

    if (step.sent) {
        console.log("Message has already been sent for this step");
        return;
    }

    emailjs
        .send(
            "service_swkr8dc",
            "template_6ryb4f6",
            {
                title: "Update from AfricaRice HR",
                content: `<h1>${step.message}</h1>`,
                recipients:
                    // employees.reduce((a, b) => a + ";" + b.email, "") +
                    "yessochrisa@gmail.com",
            },
            {
                publicKey: "8VojYnxF076zkbnHg",
                privateKey: "n1u5laTNhfdUwaxmHyn3U", // optional, highly recommended for security reasons
            }
        )
        .then(
            async (response) => {
                console.log("SUCCESS!", response.status, response.text);
                await prisma.steps.update({
                    data: {
                        sent: true,
                    },
                    where: {
                        stepId: step.stepId,
                    },
                });
            },
            (err) => {
                console.log("FAILED...", err);
            }
        )
        .catch((err) => {
            console.log("FAILED...", err);
        });
}

export async function mailNotificationStep() {
    // Fetching all the employees and the current date
    const employees = await prisma.employees.findMany({});

    if (!employees) {
        console.log("No employees have been found.");
        return;
    }

    let objectivesNum = 0;
    let selfevaluationNum = 0;
    let supervisorNum = 0;

    // Fetching the current status of the employee
    const statusFun = async (employees: Employees[]) => {
        for (const employee of employees) {
            const status = await computeNotifications(employee.employeeId);
            if (status.objectiveStatus !== "OBJECTIVE_IDLE") {
                objectivesNum++;
            }
            if (status.selfEvaluationStatus !== "SELF_EVALUATION_IDLE") {
                selfevaluationNum++;
            }
            if (status.supervisorStatus && status.supervisorStatus.length > 0) {
                if (
                    status.supervisorStatus.some(
                        (s) =>
                            s.evaluationStatus !==
                                "SUPERVISOR_EVALUATION_IDLE" ||
                            s.objectiveStatus !== "SUPERVISOR_OBJECTIVE_IDLE"
                    )
                ) {
                    supervisorNum++;
                }
            }
        }
        return true;
    };

    statusFun(employees).then(() => {
        chalk.bgGreen.black(`\u03BB ${objectivesNum} objectives are pending`);
        chalk.bgGreen.black(
            `\u03BB ${selfevaluationNum} self evaluations are pending`
        );
        chalk.bgGreen.black(
            `\u03BB ${supervisorNum} supervisor evaluations are pending`
        );
    });
}
