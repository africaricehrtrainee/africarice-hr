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

export function xlsxToJsonArray(data: any): any[] {
    // Load the XLSX file
    const workbook = read(data, {
        dateNF: "MM-DD-YYYY",
    });
    // Assume that the first sheet in the workbook should be converted to JSON
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Convert the worksheet data to an array of objects
    let jsonArray: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
        F: string;
        G: string;
        H: string;
        I: string;
        J: string;
        K: string;
        M: string;
        N: string;
        O: string;
        P: string;
    }[] = utils.sheet_to_json(worksheet, {
        header: "A",
        raw: false,
    });

    jsonArray = jsonArray.slice(2);
    let output = jsonArray.map((value, index) => ({
        matricule: value["A"],
        lastName: value["B"].split(",")[0].toUpperCase(),
        firstName: toTitleCase(value["B"].split(",")[1]).trim(),
        grade: value["C"],
        resourceType: value["G"],
        sex: value["H"],
        birthday: value["I"],
        firstNationality: value["K"],
        educationLevel: value["M"],
        email:
            value["B"].charAt(0).toLowerCase() +
            "." +
            value["B"].split(",")[1].trim().split(" ")[0].toLowerCase() +
            "@cgiar.org",
        password: value["A"] + value["I"].substring(value["I"].length - 4),
    }));
    console.log(output);
    return output;
}
