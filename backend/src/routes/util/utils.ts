import {
	OtherEvaluation360,
	StaffEvaluation360Status,
	StaffObjectiveStatus,
	StaffSelfEvaluationStatus,
	Status,
	SupervisorEvaluation360Status,
	SupervisorEvaluationStatus,
	SupervisorObjectiveStatus,
	SupervisorStatus,
} from "./../../global.d";
import { compareAsc } from "date-fns";
import prisma from "../../../prisma/middleware";

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

export async function computeFinished(employeeId: number): Promise<boolean> {
	let status = await computeNotifications(employeeId);
	if (
		status.objectiveStatus === "OBJECTIVE_EMPTY" ||
		status.objectiveStatus === "OBJECTIVE_INVALID" ||
		status.objectiveStatus === "OBJECTIVE_UNRATED"
	) {
		return false;
	} else if (status.selfEvaluationStatus === "SELF_EVALUATION_EMPTY") {
		return false;
	} else if (
		status.evaluation360Status === "EVALUATION360_EMPTY" ||
		status.evaluation360Status === "EVALUATION360_INVALID"
	) {
		return false;
	} else if (
		status.otherEvaluation360Status.length > 0 &&
		status.otherEvaluation360Status.some(
			(obj) => obj.evaluationStatus === "EVALUATION360_UNRATED"
		)
	) {
		return false;
	} else if (
		status.supervisorStatus &&
		status.supervisorStatus?.length > 0 &&
		status.supervisorStatus.some(
			(obj) =>
				obj.evaluationStatus === "SUPERVISOR_EVALUATION_UNRATED" ||
				obj.objectiveStatus === "SUPERVISOR_OBJECTIVE_UNRATED" ||
				obj.objectiveStatus == "SUPERVISOR_OBJECTIVE_UNVALIDATED" ||
				obj.objectiveStatus === "SUPERVISOR_OBJECTIVE_UNREVIEWED" ||
				obj.evaluation360Status ===
					"SUPERVISOR_EVALUATION360_UNREVIEWED"
		)
	) {
		return false;
	} else {
		return true;
	}
}

export async function computeNotifications(
	employeeId: number
): Promise<Status> {
	let objectiveStatus: StaffObjectiveStatus = "OBJECTIVE_IDLE";
	let selfEvaluationStatus: StaffSelfEvaluationStatus =
		"SELF_EVALUATION_IDLE";
	let evaluation360Status: StaffEvaluation360Status = "EVALUATION360_IDLE";
	let otherEvaluation360Status: OtherEvaluation360[] = [];
	let supervisorStatus: SupervisorStatus[] = [];

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
			objectiveYear: new Date().getFullYear().toString(),
		},
	});

	const evaluation = await prisma.evaluations.findFirst({
		where: {
			employeeId,
			evaluationYear: new Date().getFullYear().toString(),
		},
	});

	const evaluation360 = await prisma.evaluation360.findFirst({
		where: {
			employeeId,
			evaluationYear: new Date().getFullYear().toString(),
		},
	});

	const evaluator360 = await prisma.evaluator360.findMany({
		where: {
			evaluatorId: employeeId,
			evaluatorStatus: "ok",
		},
	});

	const team = await prisma.employees.findMany({
		where: {
			supervisorId: employeeId,
		},
	});

	// 360 Evaluation computation

	if (evaluation360) {
		const evaluator360 = await prisma.evaluator360.findMany({
			where: {
				evaluationId: evaluation360.evaluation360Id,
			},
		});

		if (evaluator360.length >= 3) {
			if (evaluator360.some((obj) => obj.evaluatorStatus == "invalid")) {
				evaluation360Status = "EVALUATION360_INVALID";
			} else if (
				evaluator360.every((obj) => obj.evaluatorStatus == "sent")
			) {
				evaluation360Status = "EVALUATION360_SENT";
			} else if (
				evaluator360.every((obj) => obj.evaluatorStatus == "ok")
			) {
				evaluation360Status = "EVALUATION360_OK";
			} else if (
				evaluator360.every((obj) => obj.evaluatorStatus == "evaluated")
			) {
				evaluation360Status = "EVALUATION360_RATED";
			}
		} else {
			evaluation360Status = "EVALUATION360_EMPTY";
		}
	} else {
		evaluation360Status = "EVALUATION360_EMPTY";
	}

	// Other forms status
	if (evaluator360.length > 0) {
		const arr = evaluator360.map(async (element) => {
			const evaluation = await prisma.evaluation360.findFirst({
				where: { evaluation360Id: element.evaluationId },
			});

			if (element && element.evaluatorStatus !== "evaluated") {
				return {
					employeeId: evaluation?.employeeId ?? -1,
					evaluationStatus: "EVALUATION360_UNRATED",
				};
			} else {
				return {
					employeeId: evaluation?.employeeId ?? -1,
					evaluationStatus: "EVALUATION360_RATED",
				};
			}
		});
		// @ts-ignore
		otherEvaluation360Status = await Promise.all(arr);
	}

	// Objective status computation

	// Objective submission period has started
	if (compareAsc(new Date(), steps[0].dateFrom) !== -1) {
		// Objective is not between 3 and 5 inclusive or aren't all sent
		if (
			objectives.filter((obj) => obj.status).length < 3 ||
			objectives.filter((obj) => obj.status !== "cancelled").length > 5 ||
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

			if (compareAsc(new Date(), steps[2].dateFrom) !== -1) {
				if (objectives.every((obj) => obj.midtermSelfComment)) {
					objectiveStatus = "OBJECTIVE_REVIEWED";

					if (compareAsc(new Date(), steps[3].dateFrom) !== -1) {
						// Some objectives are unrated
						if (objectives.some((obj) => obj.selfComment == null)) {
							objectiveStatus = "OBJECTIVE_UNRATED";
						}
						// All objectives are rated
						else {
							objectiveStatus = "OBJECTIVE_RATED";
						}
					}
				} else {
					objectiveStatus = "OBJECTIVE_UNREVIEWED";
				}
				// Self-evaluation period is there
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
	const arr = team.map(async (member) => {
		let objectiveStatus: SupervisorObjectiveStatus =
			"SUPERVISOR_OBJECTIVE_IDLE";
		let evaluationStatus: SupervisorEvaluationStatus =
			"SUPERVISOR_EVALUATION_IDLE";
		let evaluation360Status: SupervisorEvaluation360Status =
			"SUPERVISOR_EVALUATION360_IDLE";
		const objectives = await prisma.objectives.findMany({
			where: {
				employeeId: member.employeeId,
				status: {
					not: "cancelled",
				},
				objectiveYear: new Date().getFullYear().toString(),
			},
		});
		//
		const evaluation = await prisma.evaluations.findFirst({
			where: {
				employeeId: member.employeeId,
				evaluationYear: new Date().getFullYear().toString(),
			},
		});

		const evaluation360 = await prisma.evaluation360.findFirst({
			where: {
				employeeId: member.employeeId,
				evaluationYear: new Date().getFullYear().toString(),
			},
		});

		if (evaluation360) {
			const evaluators360 = await prisma.evaluator360.findMany({
				where: {
					evaluationId: evaluation360.evaluation360Id,
				},
			});

			if (evaluators360.length > 0) {
				if (
					evaluators360.some((obj) => obj.evaluatorStatus == "sent")
				) {
					evaluation360Status = "SUPERVISOR_EVALUATION360_UNREVIEWED";
				} else {
					evaluation360Status = "SUPERVISOR_EVALUATION360_REVIEWED";
				}
			}
		}

		// Objective supervisor status computation
		if (
			compareAsc(new Date(), steps[1].dateFrom) !== -1 &&
			objectives.length >= 3
		) {
			// Objective Validation
			if (objectives.some((obj) => obj.status == "sent")) {
				objectiveStatus = "SUPERVISOR_OBJECTIVE_UNVALIDATED";
			} else {
				objectiveStatus = "SUPERVISOR_OBJECTIVE_VALIDATED";
				// Objective Midterm Review
				if (compareAsc(new Date(), steps[2].dateFrom) !== -1) {
					if (objectives.some((obj) => !obj.midtermComment)) {
						objectiveStatus = "SUPERVISOR_OBJECTIVE_UNREVIEWED";
					} else {
						objectiveStatus = "SUPERVISOR_OBJECTIVE_REVIEWED";
						if (compareAsc(new Date(), steps[4].dateFrom) !== -1) {
							if (
								objectives.some(
									(obj) => obj.evaluationStatus !== "sent"
								)
							) {
								objectiveStatus =
									"SUPERVISOR_OBJECTIVE_UNRATED";
							} else {
								objectiveStatus = "SUPERVISOR_OBJECTIVE_RATED";
							}
						}
					}
				}
			}
		} else {
			objectiveStatus = "SUPERVISOR_OBJECTIVE_IDLE";
		}

		if (compareAsc(new Date(), steps[3].dateFrom) !== -1) {
			if (evaluation && evaluation.evaluationStatus == "sent") {
				evaluationStatus = "SUPERVISOR_EVALUATION_RATED";
			} else if (evaluation && evaluation.evaluationStatus == "draft") {
				evaluationStatus = "SUPERVISOR_EVALUATION_UNRATED";
			}
		}

		return {
			objectiveStatus,
			evaluationStatus,
			evaluation360Status,
			employeeId: member.employeeId,
		};
	});

	supervisorStatus = await Promise.all(arr);
	return {
		objectiveStatus,
		evaluation360Status,
		otherEvaluation360Status,
		selfEvaluationStatus,
		supervisorStatus,

		// Supervisor status computation
	};
}
