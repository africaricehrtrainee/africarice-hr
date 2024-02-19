import { clsx, ClassValue } from "clsx";
import { read, readFile, utils } from "xlsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function toTitleCase(sentence: string): string {
    return sentence.replace(/\w\S*/g, (txt: string) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
}

export const getCurrentMySQLDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // January is 0 in JavaScript
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};



export function constructPositionTree(
    employees: Employee[],
    supervisorId?: number
): Employee[] {
    const filteredEmployees = employees.filter((e) =>
        supervisorId ? e.supervisorId === supervisorId : !e.supervisorId
    );

    return filteredEmployees.map((employee) => ({
        ...employee,
        subordinates: constructPositionTree(employees, employee.employeeId),
    }));
}
