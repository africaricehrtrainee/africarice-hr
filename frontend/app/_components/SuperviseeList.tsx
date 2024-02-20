// SuperviseeList.tsx

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Button from "../../components/ui/Button";
import { cn } from "@/util/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface SuperviseeListProps {
    employees: Employee[];
}

const SuperviseeList: React.FC<SuperviseeListProps> = ({ employees }) => {
    const [search, setSearch] = useState("");
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="relative flex h-[500px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            {/* <div className="absolute right-4 top-4 flex items-center justify-center gap-2">
                <Button className="" onClick={() => {}} variant="primary">
                    Download reports
                    <Icon
                        icon="mingcute:download-3-fill"
                        className="ml-1"
                        fontSize={16}
                    />
                </Button>
            </div> */}
            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-full bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-700">
                Notifications
                <Icon
                    icon="fluent:board-16-filled"
                    className="ml-1"
                    fontSize={10}
                />
            </div>
            <div className="mt-2 flex w-full items-end justify-between">
                <p className="text-2xl font-bold text-zinc-700">My Team</p>
            </div>
            <div className="mt-2 h-[1px] w-full bg-zinc-100"></div>
            <div className="scroll-hover mt-4 h-full w-full flex-col items-start justify-start overflow-y-scroll transition-all">
                {employees
                    .filter((employee) => {
                        return (
                            true &&
                            (employee.firstName
                                ?.toLowerCase()
                                .includes(search) ||
                                employee.lastName
                                    ?.toLowerCase()
                                    .includes(search) ||
                                employee.matricule
                                    ?.toLowerCase()
                                    .includes(search))
                        );
                    })
                    .map((employee, i) => {
                        return (
                            <div
                                className={cn(
                                    "grid grid-cols-4 w-full mt-1 relative items-end justify-start rounded-md border-b border-zinc-100 p-2 px-4 transition-all"
                                )}
                                key={i}
                            >
                                <div className="flex items-center justify-start">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-zinc-50">
                                        {employee.firstName.charAt(0) +
                                            employee.lastName.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        STAFF NAME
                                    </p>
                                    <p
                                        className={cn(
                                            "text-xs text-zinc-700 max-w-[150px] truncate font-medium"
                                        )}
                                    >
                                        {employee.lastName +
                                            " " +
                                            employee.firstName.split(" ")[0]}
                                    </p>
                                </div>
                                <div className="flex items-center justify-start">
                                    <Button
                                        variant="underline"
                                        onClick={() => {
                                            router.push(
                                                `/objectives/${employee.employeeId}`
                                            );
                                        }}
                                    >
                                        View objectives
                                    </Button>
                                </div>
                                <div className="flex items-center justify-start">
                                    <Button
                                        variant="underline"
                                        onClick={() => {
                                            router.push(
                                                `/global/${employee.employeeId}`
                                            );
                                        }}
                                    >
                                        View 360 evaluations
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default SuperviseeList;
