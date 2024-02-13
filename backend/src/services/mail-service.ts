import emailjs from "@emailjs/nodejs";
import { DbService } from "./db-service";
import { compareAsc } from "date-fns";
import { Prisma, PrismaClient } from "@prisma/client";

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
                gte: date,
            },
        },
        orderBy: {
            dateFrom: "asc",
        },
    });

    if (!step) {
        console.log("No performance step has been found");
        return;
    }

    console.log("Current evaluation step is: " + `\u001b${step.name}`);

    if (!step.sent) {
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
        );
}
