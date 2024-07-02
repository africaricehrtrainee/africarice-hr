import path from "path";
import fs from "fs";
import { parse } from "csv-parse";
import { readFile, utils } from "xlsx";
import bcrypt from "bcrypt";
import stringSimilarity from "string-similarity";
import prisma from "../../prisma/middleware";

function toTitleCase(str: string): string {
	return str.replace(/\w\S*/g, (txt: string) => {
		return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
	});
}

function calculateDepth(data: EmployeeCreateDTO[], employeeId: number): number {
	let depth = 0;
	let supervisorId = data.find(
		(e) => e.employeeId === employeeId
	)?.supervisorId;
	let name =
		data.find((e) => e.employeeId === employeeId)?.firstName +
		" " +
		data.find((e) => e.employeeId === employeeId)?.lastName;

	while (supervisorId) {
		name =
			data.find((e) => e.employeeId === supervisorId)?.firstName +
			" " +
			data.find((e) => e.employeeId === supervisorId)?.lastName;
		depth++;
		supervisorId =
			data.find((e) => e.employeeId === supervisorId)?.supervisorId ??
			null;
	}

	return depth;
}

function sortByHierarchyLevel(data: EmployeeCreateDTO[]): EmployeeCreateDTO[] {
	data.sort((a, b) => {
		const val =
			calculateDepth(data, a.employeeId) -
			calculateDepth(data, b.employeeId);
		return val;
	});
	return data;
}
interface EmployeeCreateDTO {
	employeeId: number;
	matricule: string;
	firstName: string;
	lastName: string;
	supervisorId: number | null;
	jobTitle: string;
	email: string;
	password: string;
	role: string;
}

function parseCsvToJson(filePath: string): Promise<any[]> {
	return new Promise((resolve, reject) => {
		const results: any[] = [];

		fs.createReadStream(filePath)
			.pipe(
				parse({
					columns: true, // this will treat the first row as header names
					skip_empty_lines: true, // skip empty lines
				})
			)
			.on("data", (data) => results.push(data))
			.on("end", () => {
				resolve(results);
			})
			.on("error", (error) => {
				reject(error);
			});
	});
}

// Use the function and log the results

export async function xlsxToJsonArray(fileUrl: any): Promise<any[]> {
	// Load the XLSX file
	const workbook = readFile(fileUrl, {
		dateNF: "MM-DD-YYYY",
	});

	// Assume that the first sheet in the workbook should be converted to JSON
	const sheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[sheetName];
	// Convert the worksheet data to an array of objects
	let data: {
		B?: string;
		C: string;
		L: string;
		I: string;
		Q: string;
	}[] = utils.sheet_to_json(worksheet, {
		header: "A",
		raw: true,
	});

	// Map the array of objects to the desired format
	// The current format of the worksheet is as follows
	// B : Matricule, C : Full Name, L : Supervisor Matricule, I : Job Title
	data = data.slice(1);
	const output = data
		.filter((val) => val["B"] !== undefined)
		.map((value, index) => {
			let employeeId = index + 2;
			let matricule = value["B"] ?? "";

			// Name formatting
			let firstName = "";
			let lastName = "";

			if (value["C"].includes(",")) {
				firstName = value["C"].split(",")[1];
				lastName = value["C"].split(",")[0];
			} else {
				firstName = value["C"].split(" ")[1];
				lastName = value["C"].split(" ")[0];
			}

			// Supervisor finding
			let supervisorId;

			if (value["L"]) {
				let match = data.findIndex(
					(sheet) => sheet["B"] === value["L"]
				);
				if (match !== -1) {
					supervisorId = match + 2;
				} else {
					supervisorId = null;
				}
			} else {
				supervisorId = null;
			}

			// Otherwise, leave blank

			// Job title
			let jobTitle = "";
			if (value["I"]) {
				jobTitle = toTitleCase(value["I"].toString());
			}

			// Password creation
			// let password = matricule;
			let password = bcrypt.hashSync(matricule, 10);
			let email = value["Q"]
				? value["Q"].toLowerCase().trim()
				: `${matricule}@cgiar.org`;

			return {
				employeeId,
				matricule,
				firstName: toTitleCase(firstName).trim(),
				lastName: lastName.trim().toUpperCase(),
				supervisorId,
				jobTitle,
				email,
				password,
				role: "staff",
				deletedAt: null,
			};
		});

	if (output.length > 1) {
		console.log("\u03BB Updating employee list");
		const arr = sortByHierarchyLevel(output);

		prisma
			.$transaction(
				arr.map((employee, i) => {
					return prisma.employees.upsert({
						where: {
							employeeId: employee.employeeId,
						},
						update: { ...employee },
						create: employee,
					});
				})
			)
			.catch((err) => {
				console.log(err);
			});
	}

	return output;
}

export default function employeeDatabaseInit() {
	// Usage example
	const filePath = path.join(__dirname, "..", "..", "db", "employees.xlsx");
	const jsonArray = xlsxToJsonArray(filePath);
}
