import prisma from "./middleware";

export default function startup() {
    prisma.employees
        .create({
            data: {
                email: "admin@mail.com",
                firstName: "Admin",
                lastName: "Platform",
                jobTitle: "Administrator",
                password: "admin",
                role: "admin",
                employeeId: 1,
            },
        })
        .catch((err) => {});

    prisma.steps
        .createMany({
            data: [
                {
                    stepId: 1,
                    name: "Objective Submission",
                    message:
                        "The objective submission period has started. Please take the time to submit your objectives on the performance platform.",
                    active: false,
                    dateFrom: "2024-01-01",
                    dateTo: "2024-01-07",
                },

                {
                    stepId: 2,
                    name: "Objective Validation",
                    message:
                        "The objective validation period has started. Please take the time to validate your team's objectives on the performance platform.",
                    active: false,
                    dateFrom: "2024-01-08",
                    dateTo: "2024-01-14",
                },

                {
                    stepId: 3,
                    name: "Midterm Review",
                    message:
                        "The midterm review period has started. Please take the time to review your team's as well as your objectives on the performance platform.",
                    active: false,
                    dateFrom: "2024-01-08",
                    dateTo: "2024-01-14",
                },

                {
                    stepId: 4,
                    name: "Staff Self-Evaluation",
                    message:
                        "The self-evaluation period has started. Please take the time to self-evaluate your performance and your objectives on the performance platform.",
                    active: false,
                    dateFrom: "2024-01-15",
                    dateTo: "2024-01-21",
                },

                {
                    stepId: 5,
                    name: "Supervisor Evaluation",
                    message:
                        "The evaluation period has started. Please take the time to evaluate your team's performance and objectives on the performance platform.",
                    active: true,
                    dateFrom: "2024-01-22",
                    dateTo: "2024-01-28",
                },
            ],
        })
        .then(() => {})
        .catch((err) => {});
}
