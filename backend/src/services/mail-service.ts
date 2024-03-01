import emailjs from "@emailjs/nodejs";
import { DbService } from "./db-service";
import { compareAsc } from "date-fns";
import { Employees, Prisma, PrismaClient } from "@prisma/client";
import { computeFinished, computeNotifications } from "../routes/util/utils";
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

    emailjs
        .send(
            "service_swkr8dc",
            "template_6ryb4f6",
            {
                title: "Update from AfricaRice HR",
                content: `<h1>${step.message}</h1>`,
                recipients: employees.reduce((a, b) => a + ";" + b.email, ""),
                // "yessochrisa@gmail.com",
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

    emailjs
        .send(
            "service_swkr8dc",
            "template_6ryb4f6",
            {
                title: "Update from AfricaRice HR",
                content: `<h1>Reminder: You have pending tasks to complete</h1>`,
                recipients: recipients.join(";"),
            },
            {
                publicKey: "8VojYnxF076zkbnHg",
                privateKey: "n1u5laTNhfdUwaxmHyn3U", // optional, highly recommended for security reasons
            }
        )
        .then(
            (response) => {
                console.log("SUCCESS!", response.status, response.text);
            },
            (err) => {
                console.log("FAILED...", err);
            }
        );
}
