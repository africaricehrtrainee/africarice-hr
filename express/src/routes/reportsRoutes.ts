import { Request, Response, Router } from "express";
import prisma from "../../prisma/middleware";

const router = Router();

router.use("/evaluation", async (req: Request, res: Response) => {
	// Download a dummy excel spreadsheet file
	const totalEmployees = await prisma.employees.count({
		where: {
			supervisorId: {
				not: null,
			},
		},
	});

	const employeesWithFinishedObjectives = await prisma.employees.findMany({
		include: {
			_count: {
				select: {
					objectives: {
						where: {
							status: "ok",
						},
					},
				},
			},
		},
	});

	const employeesWithFinishedEvaluations = await prisma.employees.findMany({
		include: {
			_count: {
				select: {
					evaluations: {
						where: {
							AND: [
								{ selfEvaluationStatus: "ok" },
								{ evaluationStatus: "ok" },
							],
						},
					},
				},
			},
		},
	});

	const employeesWithSubmitted360 = await prisma.employees.findMany({
		include: {
			_count: {
				select: {
					evaluations360: {
						where: {
							OR: [
								{
									evaluators: {
										some: {
											evaluatorStatus: "sent",
										},
									},
								},
								{
									evaluators: {
										some: {
											evaluatorStatus: "ok",
										},
									},
								},
							],
						},
					},
				},
			},
		},
	});

	if (
		!employeesWithFinishedObjectives ||
		!employeesWithFinishedEvaluations ||
		!employeesWithSubmitted360
	)
		return res.status(404).send("No employees found");

	const totalEmployeesWithFinishedObjectives =
		employeesWithFinishedObjectives.filter((employee) => {
			return employee._count.objectives > 0;
		}).length;

	const totalEmployeesWithFinishedEvaluations =
		employeesWithFinishedEvaluations.filter((employee) => {
			return employee._count.evaluations > 0;
		}).length;

	const totalEmployeesWithSubmitted360 = employeesWithSubmitted360.filter(
		(employee) => {
			return employee._count.evaluations360 > 0;
		}
	).length;

	return res.send({
		totalEmployees,
		totalEmployeesWithFinishedObjectives,
		totalEmployeesWithFinishedEvaluations,
		totalEmployeesWithSubmitted360,
	});
});

export default router;
