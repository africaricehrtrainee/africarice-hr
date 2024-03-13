import {
    Objectives,
    PrismaClient,
    Prisma,
    Evaluations,
    Evaluator360,
} from "@prisma/client";
import sendMail from "../src/services/mail-service";
import crypto from "crypto";
const prisma = new PrismaClient();

const objectiveMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.model === "Objectives" && params.action === "update") {
        const current = params.args.data as Objectives;

        const previous = await prisma.objectives.findUnique({
            where: { objectiveId: current.objectiveId },
        });

        const result = await next(params);

        if (!current.supervisorId) {
            return;
        }

        const supervisor = await prisma.employees.findUnique({
            where: { employeeId: current.supervisorId },
        });

        const employee = await prisma.employees.findUnique({
            where: { employeeId: current.employeeId },
        });

        const objectives = await prisma.objectives.findMany({
            where: {
                employeeId: current.employeeId,
                objectiveYear: current.objectiveYear,
            },
        });

        const hash = crypto
            .createHash("md5")
            .update(JSON.stringify(objectives))
            .digest("hex");

        if (!employee || !supervisor) return;

        if (previous && previous.status !== current.status) {
            if (current.status == "sent") {
                if (
                    objectives.every(
                        (o) => o.status !== "draft" && o.status !== "invalid"
                    )
                ) {
                    prisma.alerts
                        .create({
                            data: {
                                hash,
                                recipientId: supervisor.employeeId,
                            },
                        })
                        .then(() => {
                            sendMail({
                                title: "Requested Action from HR",
                                content: `Dear ${
                                    supervisor.firstName.split(" ")[0]
                                }, a member of your team has submitted their objectives and is awaiting your review.`,
                                recipients: [supervisor.email],
                            });
                        })
                        .catch((err) => {});
                    // STAFF_SUBMITTED
                }
            }
            if (current.status == "ok" || current.status == "invalid") {
                // OBJECTIVES_VALIDATED

                if (
                    objectives.every(
                        (o) => o.status == "ok" || o.status == "invalid"
                    )
                ) {
                    if (objectives.every((o) => o.status == "ok")) {
                    } else {
                        prisma.alerts
                            .create({
                                data: {
                                    hash,
                                    recipientId: employee.employeeId,
                                },
                            })
                            .then(() => {
                                sendMail({
                                    title: "Requested Action from HR",
                                    content: `Dear ${
                                        employee.firstName.split(" ")[0]
                                    }, your supervisor has reviewed your objectives and has requested changes.`,
                                    recipients: [employee.email],
                                });
                            })
                            .catch((err) => {});
                    }
                    // ALL_OBJECTIVES_VALIDATED
                } else {
                }
            }
        }

        if (previous && previous.reviewStatus !== current.reviewStatus) {
            if (current.reviewStatus == "sent") {
                if (objectives.every((o) => o.reviewStatus == "sent")) {
                    // ALL_OBJECTIVES_REVIEWE
                    prisma.alerts
                        .create({
                            data: {
                                hash,
                                recipientId: employee.employeeId,
                            },
                        })
                        .then(() => {
                            sendMail({
                                title: "Information from HR",
                                content: `Dear ${
                                    employee.firstName.split(" ")[0]
                                }, your supervisor has reviewed your progress for the midterm period.`,
                                recipients: [employee.email],
                            });
                        })
                        .catch((err) => {});
                }
            }
        }

        if (
            previous &&
            previous.evaluationStatus !== current.evaluationStatus
        ) {
            if (current.evaluationStatus == "sent") {
                if (objectives.every((o) => o.evaluationStatus == "sent")) {
                    // ALL_EVALUATIONS_SUBMITTED

                    prisma.alerts
                        .create({
                            data: {
                                hash,
                                recipientId: employee.employeeId,
                            },
                        })
                        .then(() => {
                            sendMail({
                                title: "Requested Action from HR",
                                content: `Dear ${
                                    employee.firstName.split(" ")[0]
                                }, your supervisor has evaluated all your objectives.`,
                                recipients: [employee.email],
                            });
                        })
                        .catch((err) => {});
                }
            }
        }

        return result;
    }

    return next(params);
};

const evaluationMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.model === "Evaluations" && params.action === "upsert") {
        const current = params.args.create
            ? (params.args.create as Evaluations)
            : (params.args.update as Evaluations);

        const result = await next(params);

        const employee = await prisma.employees.findUnique({
            where: { employeeId: current.employeeId },
        });

        const supervisor = await prisma.employees.findUnique({
            where: { employeeId: current.supervisorId },
        });

        if (!employee || !supervisor) return;

        const hash = crypto
            .createHash("md5")
            .update(JSON.stringify(current))
            .digest("hex");

        if (current.evaluationStatus == "sent") {
            // evaluationSubmitted
            prisma.alerts
                .create({
                    data: {
                        hash,
                        recipientId: employee.employeeId,
                    },
                })
                .then(() => {
                    sendMail({
                        title: "Information from HR",
                        content: `Dear ${
                            employee.firstName.split(" ")[0]
                        }, your supervisor has submitted your compentency evaluation.`,
                        recipients: [employee.email],
                    });
                })
                .catch((err) => {});
        }

        return result;
    }

    return next(params);
};

const evaluation360Middleware: Prisma.Middleware = async (params, next) => {
    if (params.model === "Evaluator360" && params.action === "update") {
        const current = params.args.data as Evaluator360;

        const previous = await prisma.evaluator360.findUnique({
            where: { evaluator360Id: current.evaluator360Id },
        });

        const result = await next(params);

        const evaluation = await prisma.evaluation360.findUnique({
            where: { evaluation360Id: current.evaluationId },
        });

        if (!evaluation) return;

        const employee = await prisma.employees.findUnique({
            where: { employeeId: evaluation.employeeId },
        });

        const supervisor = await prisma.employees.findUnique({
            where: { employeeId: evaluation.supervisorId },
        });

        if (!employee || !supervisor) return;

        const evaluations = await prisma.evaluator360.findMany({
            where: { evaluationId: current.evaluationId },
        });

        const evaluator = await prisma.employees.findUnique({
            where: { employeeId: current.evaluatorId },
        });

        const hash = crypto
            .createHash("md5")
            .update(JSON.stringify(evaluations))
            .digest("hex");

        if (
            previous &&
            previous.evaluatorStatus !== current.evaluatorStatus &&
            evaluations &&
            evaluator
        ) {
            if (current.evaluatorStatus === "sent") {
                if (evaluations.every((e) => e.evaluatorStatus === "sent")) {
                    prisma.alerts
                        .create({
                            data: {
                                hash,
                                recipientId: supervisor.employeeId,
                            },
                        })
                        .then(() => {
                            sendMail({
                                title: "Required Action from HR",
                                content: `Dear ${
                                    supervisor.firstName.split(" ")[0]
                                }, a member of your team has submitted their 360 evaluation and is awaiting your review.`,
                                recipients: [supervisor.email],
                            });
                        })
                        .catch((err) => {});
                }
            }
            if (
                current.evaluatorStatus === "ok" ||
                current.evaluatorStatus === "invalid"
            ) {
                if (current.evaluatorStatus === "ok") {
                    prisma.alerts
                        .create({
                            data: {
                                hash,
                                recipientId: evaluator.employeeId,
                            },
                        })
                        .then(() => {
                            sendMail({
                                title: "Requested Action from HR",
                                content: `Dear ${
                                    evaluator.firstName.split(" ")[0]
                                }, you have received a 360 evaluation request and are required to review it.`,
                                recipients: [evaluator.email],
                            });
                        })
                        .catch((err) => {});
                }

                if (
                    evaluations.every(
                        (e) =>
                            e.evaluatorStatus === "ok" ||
                            e.evaluatorStatus === "invalid"
                    )
                ) {
                    if (evaluations.every((e) => e.evaluatorStatus === "ok")) {
                        // allEvaluationsValidated
                    } else {
                        prisma.alerts
                            .create({
                                data: {
                                    hash,
                                    recipientId: employee.employeeId,
                                },
                            })
                            .then(() => {
                                sendMail({
                                    title: "Required Action from HR",
                                    content: `Dear ${
                                        employee.firstName.split(" ")[0]
                                    }, your supervisor has reviewed your 360 evaluation and has requested changes.`,
                                    recipients: [employee.email],
                                });
                            })
                            .catch((err) => {});
                    }
                }
            }

            if (current.evaluatorStatus == "evaluated") {
                if (
                    evaluations.every((e) => e.evaluatorStatus === "evaluated")
                ) {
                    // allEvaluationsEvaluated
                    prisma.alerts
                        .create({
                            data: {
                                hash,
                                recipientId: employee.employeeId,
                            },
                        })
                        .then(() => {
                            sendMail({
                                title: "Information from HR",
                                content: `Dear ${
                                    employee.firstName.split(" ")[0]
                                }, your evaluators have evaluated your 360 form.`,
                                recipients: [employee.email],
                            });
                        });
                }
            }
        }
        return result;
    }
    return next(params);
};
// all alert types :
// - objective /submitted -> supervisor / changes -> employee/ all ok -> employee / reviewed -> staff / evaluated -> staff
// - evaluation /submitted -> staff
// - e360 /submitted -> supervisor / changes -> employee / ok -> evalutators / all reviewed -> staff
prisma.$use(objectiveMiddleware);
prisma.$use(evaluationMiddleware);
prisma.$use(evaluation360Middleware);

export default prisma;
