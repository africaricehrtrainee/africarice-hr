"use client";
import EditEmployee from "@/app/management/admin/_components/EditEmployee";
import EmployeeList from "@/app/management/admin/_components/EmployeeList";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<number>(-1);

    function fetch() {
        axios
            .get<Employee[]>(
                process.env.NEXT_PUBLIC_API_URL + "/api/employees?all=true"
            )
            .then((response) => setEmployees(response.data))
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetch();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-start justify-start p-8">
            <div className="flex h-[800px] w-full gap-4 transition-all">
                <EmployeeList
                    fetch={fetch}
                    employees={employees.sort((a, b) => a.lastName.localeCompare(b.lastName))}
                    setSelectedEmployee={setSelectedEmployee}
                    selectedEmployee={selectedEmployee}
                />
                {selectedEmployee !== -1 && (
                    <EditEmployee
                        selectedEmployee={employees.find((e) => e.employeeId === selectedEmployee) as Employee}
                        fetch={fetch}
                    />
                )}
            </div>
        </main>
    );
}
