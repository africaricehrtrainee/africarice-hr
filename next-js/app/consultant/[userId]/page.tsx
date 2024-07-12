"use client"
import { useGetEmployeeById } from "@/features/employees/queries/getEmployeeById";

export default function Consultant({ params }: { params: { userId: string } }) {
    const { data, error } = useGetEmployeeById(parseInt(params.userId));

    if (!data) return <div></div>
    if (data.role !== "cons") return <div className="flex flex-1 items-center justify-center p-8">This employee is not a consultant.</div>
    return (
        <div>
            <h1>Consultant Page</h1>
            <p>User ID: {params.userId}</p>
        </div>
    );
}