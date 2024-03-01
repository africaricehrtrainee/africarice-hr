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
                    stepId: 0,
                    name: "Objective Submission",
                    message: "You have a new objective to submit",
                    active: false,
                    dateFrom: "2024-01-01",
                    dateTo: "2024-01-07",
                },

                {
                    stepId: 1,
                    name: "Objective Validation",
                    message: "You have an objective to approve",
                    active: false,
                    dateFrom: "2024-01-08",
                    dateTo: "2024-01-14",
                },

                {
                    stepId: 2,
                    name: "Midterm Review",
                    message: "You have a midterm review to do",
                    active: false,
                    dateFrom: "2024-01-08",
                    dateTo: "2024-01-14",
                },

                {
                    stepId: 3,
                    name: "Staff Self-Evaluation",
                    message: "You have a new self-evaluation to submit",
                    active: false,
                    dateFrom: "2024-01-15",
                    dateTo: "2024-01-21",
                },

                {
                    stepId: 4,
                    name: "Supervisor Evaluation",
                    message: "You have an evaluation to submit",
                    active: true,
                    dateFrom: "2024-01-22",
                    dateTo: "2024-01-28",
                },
            ],
        })
        .then(() => {})
        .catch((err) => {});
}
