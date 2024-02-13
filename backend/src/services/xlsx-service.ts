import path from "path";
import * as XLSX from "xlsx";

function toTitleCase(sentence: string): string {
    return sentence.replace(/\w\S*/g, (txt: string) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
}

function xlsxToJsonArray(data: any): any[] {
    // Load the XLSX file
    const workbook = XLSX.read(data, {
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
    }[] = XLSX.utils.sheet_to_json(worksheet, {
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

    console.log(jsonArray);
    console.log(output);
    return jsonArray;
}

export default function init() {
    // Usage example
    const filePath = path.join(__dirname, "..", "..", "db", "filesheet.xlsx");
    const jsonArray = xlsxToJsonArray(filePath);
}
