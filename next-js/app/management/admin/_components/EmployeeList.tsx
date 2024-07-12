// EmployeeList.tsx

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/ui/Modal";
import EmployeeForm from "./NewEmployee";
import { cn } from "@/util/utils";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface EmployeeListProps {
    employees: Array<Employee>;
    fetch: () => any; // Define the type for the "employees" prop
    setSelectedEmployee: (idx: number) => void;
    selectedEmployee: number;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
    employees,
    fetch,
    setSelectedEmployee,
    selectedEmployee,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"hr" | "admin" | "deleted" | "cons" | "">();
    const { toast } = useToast()

    async function sendTestEmail() {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/api/objectives/test")
            .then((response) => {
                if (response.status == 200) {
                    toast({
                        title: "Test email sent",
                        description: "The test email has been sent successfully",
                    })
                } else {
                    toast({
                        title: "Error",
                        description: "An error occurred while sending the test email",

                    })
                }
            })
            .catch((err) => {
                toast({
                    title: "Error",
                    description: "An error occurred while sending the test email",

                })
                console.log(err);
            })
    }

    return (
        <div className="flex h-full w-full flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-700">
                Dashboard
                <Icon
                    icon="fluent:board-16-filled"
                    className="ml-1"
                    fontSize={10}
                />
            </div>
            <div className="mt-2 flex w-full items-center justify-between">
                <p className="text-2xl font-bold text-zinc-700">
                    Staff accounts
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowModal(true)}
                    >
                        Create employee
                        <Icon
                            icon="majesticons:plus-line"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                    <Button variant="outline"
                        onClick={() => sendTestEmail()}
                    >
                        Send test email
                        <Icon
                            icon="mdi:email-send-outline"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>


                </div>
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <EmployeeForm
                        onFormSubmit={(success) => {
                            if (success) {
                                setShowModal(false);
                                fetch();
                            } else {
                            }
                        }}
                    />
                </Modal>
            </div>
            <div className="mt-2 flex items-start justify-start gap-3">
                <input
                    autoCorrect="off"
                    spellCheck="false"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for a staff member"
                    className="w-[400px] rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                />
                <button
                    type="button"
                    onClick={() =>
                        filter == "admin" ? setFilter("") : setFilter("admin")
                    }
                    className={cn(
                        "flex items-center h-full transition-all justify-center gap-0 whitespace-nowrap rounded-md p-2 px-2 text-[10px] font-semibold",
                        filter === "admin"
                            ? "bg-blue-600 text-blue-100"
                            : "bg-zinc-100 text-zinc-700"
                    )}
                >
                    Admin
                    <Icon icon="bxs:wrench" className="ml-1" fontSize={10} />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        filter == "hr" ? setFilter("") : setFilter("hr")
                    }
                    className={cn(
                        "flex items-center h-full transition-all justify-center gap-0 whitespace-nowrap rounded-md p-2 px-2 text-[10px] font-semibold",
                        filter === "hr"
                            ? "bg-purple-600 text-purple-100"
                            : "bg-zinc-100 text-zinc-700"
                    )}
                >
                    HR
                    <Icon
                        icon="iconoir:eye-solid"
                        className="ml-1"
                        fontSize={10}
                    />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        filter == "cons" ? setFilter("") : setFilter("cons")
                    }
                    className={cn(
                        "flex items-center h-full transition-all justify-center gap-0 whitespace-nowrap rounded-md p-2 px-2 text-[10px] font-semibold",
                        filter === "cons"
                            ? "bg-orange-600 text-orange-100"
                            : "bg-zinc-100 text-zinc-700"
                    )}
                >
                    Consultant
                    <Icon
                        icon="fa6-solid:hat-cowboy"
                        className="ml-2"
                        fontSize={10}
                    />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        filter == "deleted"
                            ? setFilter("")
                            : setFilter("deleted")
                    }
                    className={cn(
                        "flex items-center h-full transition-all justify-center gap-0 whitespace-nowrap rounded-md p-2 px-2 text-[10px] font-semibold",
                        filter === "deleted"
                            ? "bg-zinc-600 text-zinc-100"
                            : "bg-zinc-100 text-zinc-700"
                    )}
                >
                    Deleted
                    <Icon icon="charm:cross" className="ml-1" fontSize={10} />
                </button>
            </div>
            <div className="scroll-hover mt-8 h-full w-full flex-col items-start justify-start overflow-y-scroll transition-all">
                {employees
                    .filter((employee) => {
                        let fil: boolean;
                        switch (filter) {
                            case "hr":
                                fil = employee.role == "hr";
                                break;
                            case "admin":
                                fil = employee.role == "admin";
                                break;
                            case "cons":
                                fil = employee.role == "cons";
                                break;
                            case "deleted":
                                fil = employee.deletedAt != null;;
                                break;
                            default:
                                fil = true;
                                break;
                        }

                        return (
                            fil &&
                            (employee.firstName
                                ?.toLowerCase()
                                .includes(search.toLowerCase()) ||
                                employee.lastName
                                    ?.toLowerCase()
                                    .includes(search.toLowerCase()) ||
                                employee.email
                                    ?.toLowerCase()
                                    .includes(search.toLowerCase()) ||
                                employee.matricule
                                    ?.toLowerCase()
                                    .includes(search.toLowerCase()) ||
                                employee.jobTitle
                                    ?.toLowerCase()
                                    .includes(search.toLowerCase()))
                        );
                    })
                    .map((employee, i) => {
                        return (
                            <button
                                onClick={() => {
                                    selectedEmployee == employee.employeeId
                                        ? setSelectedEmployee(-1)
                                        : setSelectedEmployee(employee.employeeId);
                                }}
                                className={cn(
                                    "grid grid-cols-7 w-full relative items-center justify-start border-b border-t border-b-zinc-100 border-t-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50 ",
                                    `${employee.employeeId == selectedEmployee
                                        ? "bg-zinc-50 opacity-100 hover:bg-zinc-50 border-l-4 border-l-brand"
                                        : ""
                                    }`,
                                    `${employee.deletedAt && "opacity-50"}`,
                                )}
                                key={i}
                            >
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        RESNO
                                    </p>
                                    <p
                                        className={cn(
                                            "text-xs text-zinc-700 max-w-[150px] truncate font-mono",
                                            employee.employeeId == selectedEmployee
                                                ? "font-bold"
                                                : "font-medium"
                                        )}
                                    >
                                        {employee.matricule ?? "N/A"}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        EMPLOYEE ID
                                    </p>
                                    <p
                                        className={cn(
                                            "text-xs text-zinc-700 max-w-[150px] truncate font-mono",
                                            selectedEmployee == employee.employeeId
                                                ? "font-bold"
                                                : "font-medium"
                                        )}
                                    >
                                        {employee.employeeId}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        STAFF NAME
                                    </p>
                                    <p
                                        className={cn(
                                            "text-xs text-zinc-700 max-w-[150px] truncate",
                                            selectedEmployee == employee.employeeId
                                                ? "font-bold"
                                                : "font-medium"
                                        )}
                                    >
                                        {employee.lastName} {employee.firstName}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        EMAIL
                                    </p>
                                    <p className="max-w-[150px] truncate font-mono text-xs font-medium text-zinc-700">
                                        {employee.email}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        JOB TITLE
                                    </p>
                                    <p className="max-w-[150px] truncate text-xs font-medium text-zinc-700">
                                        {employee.jobTitle}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        SUPERVISOR
                                    </p>
                                    <p className="max-w-[150px] truncate text-xs font-medium text-zinc-700">
                                        {employee.supervisorId
                                            ? employees.find(
                                                (list) =>
                                                    list.employeeId ==
                                                    employee.supervisorId
                                            )?.lastName +
                                            " " +
                                            employees.find(
                                                (list) =>
                                                    list.employeeId ==
                                                    employee.supervisorId
                                            )?.firstName
                                            : "N/A"}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start justify-start">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        ROLES
                                    </p>
                                    <div className="flex gap-1">
                                        <div className="flex items-center justify-center gap-0 whitespace-nowrap rounded-md bg-zinc-100 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                            Staff
                                            <Icon
                                                icon="mdi:tag"
                                                className="ml-1"
                                                fontSize={8}
                                            />
                                        </div>
                                        {employee.role == "hr" && (
                                            <div className="flex items-center justify-center gap-0 whitespace-nowrap rounded-md bg-purple-100 p-1 px-2 text-[8px] font-semibold text-purple-700">
                                                HR
                                                <Icon
                                                    icon="iconoir:eye-solid"
                                                    className="ml-1"
                                                    fontSize={8}
                                                />
                                            </div>
                                        )}
                                        {employee.role == "admin" && (
                                            <div className="flex items-center justify-center gap-0 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-700">
                                                Admin
                                                <Icon
                                                    icon="bxs:wrench"
                                                    className="ml-1"
                                                    fontSize={8}
                                                />
                                            </div>
                                        )}
                                        {employee.role == "cons" && (
                                            <div className="flex items-center justify-center gap-0 whitespace-nowrap rounded-md bg-orange-100 p-1 px-2 text-[8px] font-semibold text-orange-700">
                                                Consultant
                                                <Icon
                                                    icon="bxs:wrench"
                                                    className="ml-1"
                                                    fontSize={8}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
            </div>
        </div>
    );
};

export default EmployeeList;
