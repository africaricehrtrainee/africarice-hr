import { Employees, Prisma, PrismaClient } from "@prisma/client";
import { computeFinished, computeNotifications } from "../routes/util/utils";
import chalk from "chalk";
import transporter from "./mail/lib/handlebars";
import prisma from "../../prisma/middleware";

export default async function sendMail({
    title,
    content,
    recipients,
}: {
    title?: string;
    content: string;
    recipients: string[];
}) {
    try {
        const options = {
            from: "AfricaRice HR <AfricaRice-HRTrainee1@cgiar.org>",
            subject: title ?? "Update from Human Resources",
            cc: recipients.join(","),
            bcc: "AfricaRice-HRTrainee1@cgiar.org",
            template: "main",
            context: {
                content,
            },
        };
        return transporter.sendMail(options);
    } catch (error) {
        console.log(error);
    }
}

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
        where: {
            email: {
                not: {
                    startsWith: "A",
                },
            },
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

    transporter
        .sendMail({
            text: step.message,
            to: "AfricaRice-HRTrainee1@cgiar.org",
        })
        .then(async () => {
            console.log("Message sent successfully");
            await prisma.steps.update({
                data: {
                    sent: true,
                },
                where: {
                    stepId: step.stepId,
                },
            });
        })
        .catch((err) => {
            console.log("Message failed to send", err);
        });
}

export async function mailNotificationStep() {
    // Fetching all the employees and the current date

    const employees = await prisma.employees.findMany({
        select: {
            email: true,
            employeeId: true,
        },
        where: {
            email: {
                not: {
                    startsWith: "A",
                },
            },
        },
    });

    if (!employees) {
        console.log("No employees have been found.");
        return;
    }

    let recipients: string[] = [];

    for (const employee of employees) {
        const finished = await computeFinished(employee.employeeId);
        if (!finished) {
            console.log(
                "Employee " +
                    employee.employeeId +
                    " has not finished all the steps"
            );
            recipients.push(employee.email);
        }
    }

    if (recipients.length < 0) {
        return;
    }

    sendMail({
        content:
            "You have not finished all the steps of the evaluation process. Please do so as soon as possible.",
        recipients: [...recipients, "AfricaRice-HRTrainee1@cgiar.org"],
    })
        .then(() => console.log("Successfully  sent notification mail"))
        .catch((err) =>
            console.log("An error occurred sending notification mail", err)
        );
}
