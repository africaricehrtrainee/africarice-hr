import Chip from "@/components/ui/Chip";
import React from "react";
import { useEvaluationDataStore } from "../_store/useStore";
import { Icon } from "@iconify/react/dist/iconify.js";

function ProfileCard({ employee }: { employee: Employee }) {
    return (
        <div className="ml-auto flex w-[350px] items-start justify-evenly gap-4 rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            <div className="flex h-full flex-col items-center justify-center gap-2">
                <Chip>
                    Staff
                    <Icon
                        icon="mingcute:profile-fill"
                        className="ml-1"
                        fontSize={14}
                    />
                </Chip>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-white">
                    {employee.firstName && employee.lastName
                        ? employee.lastName.charAt(0) +
                          employee.firstName.charAt(0)
                        : ""}
                </div>
            </div>
            <div className="flex h-full flex-col items-start justify-evenly">
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        NAME
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {employee.firstName && employee.lastName
                            ? employee.lastName + " " + employee.firstName
                            : ""}
                    </p>
                </div>
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        JOB TITLE
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {employee.jobTitle ?? "..."}
                    </p>
                </div>
            </div>
            <div className="flex h-full flex-col items-start justify-evenly">
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        SUPERVISOR (N+1)
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {employee.supervisor
                            ? employee.supervisor.lastName +
                              " " +
                              employee.supervisor.firstName
                            : "..."}
                    </p>
                </div>
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        SUPERVISOR (N+2)
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {employee.supervisor && employee.supervisor.supervisor
                            ? employee.supervisor.supervisor.lastName +
                              " " +
                              employee.supervisor.supervisor.firstName
                            : "..."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
