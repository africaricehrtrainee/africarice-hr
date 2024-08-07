import express from "express";
import { DbService } from "../services/db-service";
import { isAuthenticated } from "./authRoutes";
import { Employees } from "@prisma/client";
import prisma from "../../prisma/middleware";
import { xlsxToJsonArray } from "../services/xlsx-service";
import { getYear } from "date-fns";
import { computeNotifications } from "../util/utils";
import bcrypt from "bcrypt";

const router = express.Router();

// Route : api/employees
// Create a new employee
router.post("/", isAuthenticated, async (req, res) => {
	try {
		const { employee } = req.body;

		if (!employee) {
			res.status(400).json({ error: "Employee is required" });
			return;
		}

		const result = await prisma.employees.create({
			data: {
				...employee,
				password: bcrypt.hashSync(employee.password, 10),
			},
		});

		res.status(201).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/bulk", isAuthenticated, async (req, res) => {
	try {
		const { employees }: { employees: Employees[] } = req.body;

		if (!employees) {
			res.status(400).json({ error: "Employees are required" });
			return;
		}

		const transactionResult = await prisma.$transaction(
			employees.map((employee) => {
				return prisma.employees.upsert({
					where: { employeeId: employee.employeeId },
					update: employee,
					create: employee,
				});
			})
		);

		res.status(201).json(transactionResult);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/xlsx", isAuthenticated, async (req, res) => {
	try {
		const { document }: { document: any } = req.body;

		if (!document) {
			res.status(400).json({ error: "A document object is required" });
			return;
		}

		xlsxToJsonArray(document);

		res.status(201).json({ message: "Document uploaded successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Get all employees
router.get("/", isAuthenticated, async (req, res) => {
	try {
		if (req.query.search) {
			const result = await prisma.employees.findMany({
				where: {
					OR: [
						{
							firstName: {
								contains: req.query.search.toString(),
							},
						},
						{
							lastName: {
								contains: req.query.search.toString(),
							},
						},
					],
				},
			});
			res.status(200).json(result);
			return;
		}
		const result = await prisma.employees.findMany({
			include: {
				subordinates: true,
			},
		});
		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Get a specific employee by ID
router.get("/:id", isAuthenticated, async (req, res) => {
	const { id } = req.params;
	try {
		const result = await prisma.employees.findFirst({
			where: { employeeId: parseInt(id) },
		});
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).json({ error: "Employee not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/:id/objectives", isAuthenticated, async (req, res) => {
	try {
		const { id } = req.params;
		const { year } = req.query;
		const result = await prisma.objectives.findMany({
			where: {
				employeeId: {
					equals: parseInt(id),
				},
				objectiveYear:
					(year as string) ?? getYear(new Date()).toString(),
			},
		});

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Submit (or resubmit) all objectives
router.put("/:id/objectives/send", isAuthenticated, async (req, res) => {
	try {
		const { id } = req.params;

		const result = await prisma.objectives.updateMany({
			where: {
				AND: [
					{
						employeeId: {
							equals: parseInt(id),
						},
					},
					{
						status: {
							not: "ok",
						},
					},
				],
			},
			data: {
				status: "sent",
			},
		});

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/:id/evaluations", isAuthenticated, async (req, res) => {
	const { id } = req.params; // Get the employee ID from request params
	const { year } = req.query; // Get the year from the query string

	try {
		const result = await prisma.evaluations.findFirst({
			where: {
				employeeId: {
					equals: parseInt(id),
				},
				evaluationYear:
					(year as string) ?? getYear(new Date()).toString(),
			},
		});

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error retrieving evaluations");
	}
});

router.get("/:id/comments", isAuthenticated, async (req, res) => {
	try {
		const { id } = req.params;

		const result = await prisma.objectiveComments.findMany({
			where: {
				objective: {
					employeeId: parseInt(id),
				},
			},
			include: {
				objective: true,
			},
		});

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Get supervisors for a specific employee by Id
router.get("/:id/supervisors", isAuthenticated, async (req, res) => {
	const { id } = req.params;
	try {
		const result = await prisma.employees.findFirst({
			where: {
				employeeId: {
					equals: parseInt(id),
				},
			},
			include: {
				supervisor: {
					include: {
						supervisor: true,
					},
				},
			},
		});

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Get supervisees for a specific employee by ID
router.get("/:id/subordinates", isAuthenticated, async (req, res) => {
	const { id } = req.params;
	try {
		const result = await prisma.employees.findMany({
			where: {
				supervisorId: {
					equals: parseInt(id),
				},
			},
		});
		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Get evaluation360s of a specific employee by ID
router.get("/:id/evaluation360/", isAuthenticated, async (req, res) => {
	const { id } = req.params;
	const { year } = req.query;
	try {
		const result = await prisma.evaluation360.findFirst({
			where: {
				employeeId: {
					equals: parseInt(id),
				},
				evaluationYear:
					(year as string) ?? getYear(new Date()).toString(),
			},
		});
		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/:id/status", isAuthenticated, async (req, res) => {
	const { id } = req.params;
	try {
		if (!id) {
			res.status(400).json({ error: "Employee ID is required" });
			return;
		}

		const status = await computeNotifications(parseInt(id));
		res.status(200).json(status);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Partially Update Employee Route (HTTP PATCH)
router.patch("/:id", isAuthenticated, async (req, res) => {
	try {
		const { id } = req.params;
		const fields: Partial<Employees> = req.body;

		const result = await prisma.employees.update({
			where: {
				employeeId: parseInt(id),
			},
			data: fields,
		});
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).json({ error: "Employee not found" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Soft delete employee by id (HTTP DELETE)
router.delete("/:id", isAuthenticated, async (req, res) => {
	try {
		const { id } = req.params;
		const result = await prisma.employees.update({
			where: {
				employeeId: parseInt(id),
			},
			data: {
				deletedAt: new Date(),
			},
		});
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).json({ error: "Employee not found" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/:id/summary", isAuthenticated, async (req, res) => {
	try {
		// Fetch objectives, and evaluation file of the employee, then return a pdf file of the summary
		const { id } = req.params;
		// Year query optional query parameter
		const { year } = req.query;

		const employee = await prisma.employees.findFirst({
			where: {
				employeeId: parseInt(id),
			},
		});

		const objectives = await prisma.objectives.findMany({
			where: {
				employeeId: parseInt(id),
				objectiveYear:
					(year as string) ?? getYear(new Date()).toString(),
			},
		});

		const evaluation = await prisma.evaluations.findFirst({
			where: {
				employeeId: parseInt(id),
				evaluationYear:
					(year as string) ?? getYear(new Date()).toString(),
			},
		});

		if (!employee) {
			res.status(404).json({ error: "Employee not found" });
			return;
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
export default router;
