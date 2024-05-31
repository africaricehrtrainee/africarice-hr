"use client"

import './style.css'
import Button from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { getYear } from "date-fns";
import { useQueryState } from "nuqs";
import { useState } from "react";

interface EvaluationReport {
    totalEmployees: number;
    totalEmployeesWithFinishedObjectives: number;
    totalEmployeesWithFinishedEvaluations: number;
    totalEmployeesWithSubmitted360: number;
}

export default function Reporting() {

    const [year, setYear] = useQueryState("year", {
        defaultValue: getYear(new Date()).toString(),
    });

    const [data, setData] = useState<EvaluationReport>()

    async function generateReport() {
        const { data } = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/api/reports/evaluation")
        console.log(data)
        setData(data)
    }




    return (
        <main className="flex h-full w-full flex-1 items-start justify-center gap-4 p-8">
            <div className="flex h-full w-full flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-700">
                    Analytics
                    <Icon
                        icon="fluent:board-16-filled"
                        className="ml-1"
                        fontSize={10}
                    />
                </div>
                <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-2xl font-bold text-zinc-700">
                        Performance Reporting
                    </p>
                </div>
                <div className="flex max-w-lg flex-col items-start justify-start gap-2 rounded-md border border-zinc-100 bg-zinc-50 p-4 text-start mt-4">
                    <Select defaultValue={
                        year
                    }
                        onValueChange={(value) => setYear(value)}
                    >
                        <SelectTrigger className="w-[80px] border border-zinc-200 shadow-sm">
                            <SelectValue placeholder="Pick term" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="flex items-center justify-center gap-2 border-b border-b-zinc-200 pb-1 text-md font-bold">
                        Evaluation statistics
                        <Icon
                            icon="bi:star-fill"
                            className="text-green-500"
                            fontSize={12}
                        />
                    </p>
                    <p className="rounded-md text-sm">
                        Get an overview of the completion statistics of the evaluation process by the users during the current evaluation cycle.
                    </p>
                    <Button
                        variant="primaryOutline"
                        className="bg-white"
                        onClick={() => generateReport()}
                    >
                        Generate report
                        <Icon
                            icon="teenyicons:spreadsheet-solid"
                            className="ml-1"
                            fontSize={12}
                        />
                    </Button>
                </div>

                {/* Report HTML Table */}

                {data && <div className="flex flex-col items-start justify-start gap-4 rounded-md border border-zinc-100 bg-zinc-50 p-4 text-start mt-4">
                    <p className="flex items-center justify-center gap-2 border-b border-b-zinc-200 pb-1 text-md font-bold">
                        {year}&apos;s Evaluation statistics
                        <Icon
                            icon="bi:star-fill"
                            className="text-green-500"
                            fontSize={12}
                        />
                    </p>
                    <p className="rounded-md text-sm">
                        Get an overview of the completion statistics of the evaluation process by the users during the current evaluation cycle.
                    </p>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left"></th>
                                <th className="text-left">Completed</th>
                                <th className="text-left">Total</th>
                                <th className="text-left">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Submitted and validated yearly objectives</td>
                                <td>{data.totalEmployeesWithFinishedObjectives}</td>
                                <td>{data.totalEmployees}</td>
                                <td>{Math.round((data.totalEmployeesWithFinishedObjectives / data.totalEmployees) * 100)}%</td>
                            </tr>
                            <tr>
                                <td>Completed the competency evaluations</td>
                                <td>{data.totalEmployeesWithFinishedEvaluations}</td>
                                <td>{data.totalEmployees}</td>
                                <td>{Math.round((data.totalEmployeesWithFinishedEvaluations / data.totalEmployees) * 100)}%</td>
                            </tr>
                            <tr>
                                <td>Submitted 360 evaluator list</td>
                                <td>{data.totalEmployeesWithSubmitted360}</td>
                                <td>{data.totalEmployees}</td>
                                <td>{Math.round((data.totalEmployeesWithSubmitted360 / data.totalEmployees) * 100)}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>}
            </div>

        </main>
    );
}