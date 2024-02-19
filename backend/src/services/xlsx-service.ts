import path from "path";
import { read, readFile, utils } from "xlsx";
import stringSimilarity from "string-similarity";
import prisma from "../../prisma/middleware";
import { Employees } from "@prisma/client";

function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt: string) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
}

function calculateDepth(data: Employees[], employeeId: number): number {
    let depth = 0;
    let supervisorId = data.find(
        (e) => e.employeeId === employeeId
    )?.supervisorId;
    let name =
        data.find((e) => e.employeeId === employeeId)?.firstName +
        " " +
        data.find((e) => e.employeeId === employeeId)?.lastName;
    while (supervisorId) {
        let name =
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

function sortByHierarchyLevel(data: Employees[]): Employees[] {
    data.sort((a, b) => {
        return (
            calculateDepth(data, a.employeeId) -
            calculateDepth(data, b.employeeId)
        );
    });
    return data;
}

export function xlsxToJsonArray(fileUrl: any): any[] {
    // Load the XLSX file
    const workbook = readFile(fileUrl, {
        dateNF: "MM-DD-YYYY",
    });
    // Assume that the first sheet in the workbook should be converted to JSON
    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet data to an array of objects
    const data: {
        G?: string;
        H: string;
        J: string;
        O: string;
    }[] = utils.sheet_to_json(worksheet, {
        header: "A",
        raw: true,
    });

    // Map the array of objects to the desired format
    // The current format of the worksheet is as follows
    // G : Matricule, H : Full Name, J : Supervisor Name, O : Job Title

    const output = data
        .slice(2)
        .filter((val) => val["G"] !== undefined)
        .map((value, index) => {
            let employeeId = index + 2;
            let matricule = value["G"] ?? "";

            // Name formatting
            let firstName = "";
            let lastName = "";

            if (value["H"].includes(",")) {
                firstName = value["H"].split(",")[1];
                lastName = value["H"].split(",")[0];
            } else {
                firstName = value["H"].split(" ")[1];
                lastName = value["H"].split(" ")[0];
            }

            // Supervisor finding
            let supervisorId;

            if (value["J"]) {
                let match = stringSimilarity.findBestMatch(
                    value["J"],
                    data.slice(2).map((v) => v["H"])
                ).bestMatch.target;

                let temp = data.slice(2).findIndex((v) => v["H"] === match);
                if (temp) {
                    supervisorId = temp + 2;
                } else {
                    supervisorId = null;
                }
            } else {
                supervisorId = null;
            }

            // Mail building

            let email = `${matricule}@cgiar.org`;

            // Job title
            let jobTitle = "";
            if (value["O"]) {
                jobTitle = toTitleCase(value["O"]);
            }

            // Password creation
            let password = matricule;

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
            };
        });

    if (output.length > 1) {
        console.log("Creating all employees");
        // Prisma Upsert transaction to create or update the employees from output array
        const arr = sortByHierarchyLevel(output);

        prisma
            .$transaction(
                arr.map((employee, i) => {
                    return prisma.employees.upsert({
                        where: {
                            employeeId: employee.employeeId,
                        },
                        update: employee,
                        create: employee,
                    });
                })
            )
            .catch((err) => {
                console.log(err);
            });
    }

    return output;

    // Convert the worksheet data to an array of objects
    // let jsonArray: {
    //     A: string;
    //     B: string;
    //     C: string;
    //     D: string;
    //     E: string;
    //     F: string;
    //     G: string;
    //     H: string;
    //     I: string;
    //     J: string;
    //     K: string;
    //     M: string;
    //     N: string;
    //     O: string;
    //     P: string;
    // }[] = XLSX.utils.sheet_to_json(worksheet, {
    //     header: "A",
    //     raw: false,
    // });

    // jsonArray = jsonArray.slice(2);
    // let output = jsonArray.map((value, index) => ({
    //     matricule: value["A"],
    //     lastName: value["B"].split(",")[0].toUpperCase(),
    //     firstName: toTitleCase(value["B"].split(",")[1]).trim(),
    //     grade: value["C"],
    //     resourceType: value["G"],
    //     sex: value["H"],
    //     birthday: value["I"],
    //     firstNationality: value["K"],
    //     educationLevel: value["M"],
    //     email:
    //         value["B"].charAt(0).toLowerCase() +
    //         "." +
    //         value["B"].split(",")[1].trim().split(" ")[0].toLowerCase() +
    //         "@cgiar.org",
    //     password: value["A"] + value["I"].substring(value["I"].length - 4),
    // }));

    // console.log(jsonArray);
    // console.log(output);
    // return jsonArray;
}

export default function init() {
    // Usage example
    const filePath = path.join(__dirname, "..", "..", "db", "filesheet.xlsx");
    const jsonArray = xlsxToJsonArray(filePath);
}
