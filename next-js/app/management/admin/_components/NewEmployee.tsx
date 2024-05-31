import { Icon } from "@iconify/react/dist/iconify.js";
import React, { FC, useState } from "react";
import Button from "../../../../components/ui/Button";
import axios from "axios";
import { routeModule } from "next/dist/build/templates/app-page";
import { cn } from "@/util/utils";

interface EmployeeFormProps {
    onFormSubmit: (success: boolean) => any;
}

export interface EmployeeData {
    firstName: string | null;
    lastName: string | null;
    email: string;
    supervisorId: number | null;
    role: "hr" | "staff" | "admin";
    password: string;
    jobTitle: string;
}

const EmployeeForm: FC<EmployeeFormProps> = ({ onFormSubmit }) => {
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    const [supervisorId, setSupervisorId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [role, setRole] = useState<"hr" | "staff" | "admin">("staff");
    const [jobTitle, setJobTitle] = useState<string>("");

    const handleFormSubmit = (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        const employeeData = {
            firstName,
            lastName: lastName?.toUpperCase() ?? null,
            email,
            supervisorId : supervisorId ?? undefined,
            role,
            password: email.split("@")[0],
            jobTitle,
        };
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/api/employees", {
                employee: employeeData,
            })
            .then((response) => {
                if (response.status == 201) {
                    onFormSubmit(true);
                } else {
                }
            })
            .catch((err) => {
                onFormSubmit(false);
                alert("An error occurred");
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
                setFirstName(null);
                setLastName(null);
                setEmail("");
                setSupervisorId(null);
            });
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="flex w-[400px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-700">
                    New
                    <Icon
                        icon="ic:baseline-star"
                        className="ml-1"
                        fontSize={10}
                    />
                </div>
                <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-2xl font-bold text-zinc-700">
                        Create account
                    </p>
                </div>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        FIRST NAME
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="text"
                        value={firstName ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFirstName(e.target.value)
                        }
                        placeholder="Enter the first name"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        LAST NAME
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="text"
                        value={lastName ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLastName(e.target.value)
                        }
                        placeholder="Enter the last name"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        EMAIL ADDRESS
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter the email address"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        JOB TITLE
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="text"
                        value={jobTitle ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setJobTitle(e.target.value)
                        }
                        placeholder="Enter the job title"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        SUPERVISOR ID
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="text"
                        value={supervisorId ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSupervisorId(parseInt(e.target.value))
                        }
                        placeholder="Enter the id number"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>
                <div className="mt-4 flex flex-col items-start justify-start">
                    <p className="text-[8px] font-medium text-zinc-300">
                        ROLES
                    </p>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() =>
                                role == "hr" ? setRole("staff") : setRole("hr")
                            }
                            className={cn(
                                "flex items-center transition-all justify-center gap-0 whitespace-nowrap rounded-md p-2 px-2 text-[10px] font-semibold",
                                role === "hr"
                                    ? "bg-purple-100 text-purple-700"
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
                                role == "admin"
                                    ? setRole("staff")
                                    : setRole("admin")
                            }
                            className={cn(
                                "flex items-center transition-all justify-center gap-0 whitespace-nowrap rounded-md p-2 px-2 text-[10px] font-semibold",
                                role === "admin"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-zinc-100 text-zinc-700"
                            )}
                        >
                            Admin
                            <Icon
                                icon="bxs:wrench"
                                className="ml-1"
                                fontSize={10}
                            />
                        </button>
                    </div>
                </div>
                <div className="mt-4 flex w-full items-center justify-start gap-2">
                    <Button
                        type="submit"
                        disabled={!email}
                        variant="primary"
                        loading={loading}
                    >
                        Create account
                        <Icon
                            icon="ic:baseline-plus"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default EmployeeForm;
