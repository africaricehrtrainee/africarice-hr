import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState, useRef } from "react";
import Button from "../../../../components/ui/Button";
import axios from "axios";
import { cn } from "@/util/utils";
import LoadingBar from "react-top-loading-bar";

interface ProfileEditorProps {
    selectedEmployee?: Employee;
    fetch: () => any; // Adjust the type as per your actual employee data structure
}
const EditEmployee: React.FC<ProfileEditorProps> = ({
    selectedEmployee,
    fetch,
}) => {
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [supervisorId, setSupervisorId] = useState<number | null>(null);
    const [role, setRole] = useState<"admin" | "hr" | "staff" | "consultant">(
        "staff"
    );

    function handleUpdate(e: React.SyntheticEvent) {
        {
            e.preventDefault();
            if (
                selectedEmployee &&
                email &&
                confirm("Do you want to update this profile ?")
            ) {
                axios
                    .patch(
                        process.env.NEXT_PUBLIC_API_URL +
                            "/api/employees/" +
                            selectedEmployee.employeeId,
                        {
                            email,
                            firstName,
                            lastName: lastName?.toUpperCase(),
                            supervisorId,
                            role,
                        }
                    )
                    .then((response) =>
                        response.status == 200
                            ? alert("Successfully updated user.")
                            : alert("An error occurred.")
                    )
                    .catch((err) => console.log(err))
                    .finally(() => {
                        fetch();
                    });
            }
        }
    }

    function handleDelete(employeeId: number, revert?: boolean) {
        {
            if (revert) {
                axios
                    .patch(
                        process.env.NEXT_PUBLIC_API_URL +
                            "/api/employees/" +
                            employeeId,
                        {
                            deletedAt: null,
                        }
                    )
                    .then((response) =>
                        response.status == 201
                            ? alert("Successfully unrestricted user.")
                            : alert("An error occurred")
                    )
                    .finally(() => {
                        fetch();
                    })
                    .catch((err) => console.log(err));
            } else {
                axios
                    .delete(
                        process.env.NEXT_PUBLIC_API_URL +
                            "/api/employees/" +
                            employeeId
                    )
                    .then((response) =>
                        response.status == 201
                            ? alert("Successfully deleted user.")
                            : alert("An error occurred")
                    )
                    .finally(() => {
                        fetch();
                    })
                    .catch((err) => console.log(err));
            }
        }
    }

    useEffect(() => {
        if (selectedEmployee) {
            setFirstName(selectedEmployee.firstName);
            setLastName(selectedEmployee.lastName);
            setEmail(selectedEmployee.email);
            setSupervisorId(selectedEmployee.supervisorId);
            setRole(selectedEmployee.role);
        } else {
            setFirstName(null);
            setLastName(null);
            setEmail(null);
            setSupervisorId(null);
            setRole("staff");
        }
    }, [selectedEmployee]);

    return (
        <div className="flex w-[400px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-700">
                Edit
                <Icon
                    icon="fluent:board-16-filled"
                    className="ml-1"
                    fontSize={10}
                />
            </div>
            <div className="mt-2 flex w-full items-center justify-between">
                <p className="text-2xl font-bold text-zinc-700">Account</p>
                {selectedEmployee && selectedEmployee.deletedAt !== null && (
                    <Button
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Do you want to unrestrict this account?"
                                )
                            ) {
                                selectedEmployee &&
                                    handleDelete(
                                        selectedEmployee.employeeId,
                                        true
                                    );
                            }
                        }}
                        variant="outline"
                    >
                        Unrestrict
                        <Icon
                            icon="material-symbols:check"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                )}
                {selectedEmployee && selectedEmployee.deletedAt === null && (
                    <Button
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Do you want to restrict this account?"
                                )
                            ) {
                                selectedEmployee &&
                                    handleDelete(selectedEmployee.employeeId);
                            }
                        }}
                        variant="primary"
                    >
                        Restrict
                        <Icon
                            icon="charm:cross"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                )}
            </div>
            <form className="w-full" onSubmit={handleUpdate}>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        FIRST NAME
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="text"
                        value={firstName ?? ""}
                        onChange={(e) => setFirstName(e.target.value)}
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
                        onChange={(e) => setLastName(e.target.value)}
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
                        required
                        value={email ?? ""}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter the email address"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        SUPERVISOR ID NUMBER
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="number"
                        value={supervisorId ?? ""}
                        onChange={(e) =>
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
                <div className="mt-4 flex w-full flex-col items-start justify-start gap-2">
                    <Button
                        type="submit"
                        disabled={
                            !(
                                selectedEmployee &&
                                email &&
                                JSON.stringify([
                                    firstName,
                                    lastName,
                                    email,
                                    supervisorId,
                                    role,
                                ]) !==
                                    JSON.stringify([
                                        selectedEmployee.firstName ?? "",
                                        selectedEmployee.lastName ?? "",
                                        selectedEmployee.email,
                                        selectedEmployee.supervisorId ?? "",
                                        selectedEmployee.role ?? "staff",
                                    ])
                            )
                        }
                        variant="primary"
                    >
                        Save changes
                        <Icon
                            icon="material-symbols:save-outline"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditEmployee;
