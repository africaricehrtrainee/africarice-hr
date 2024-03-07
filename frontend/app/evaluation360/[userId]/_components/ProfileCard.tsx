import Chip from "@/components/ui/Chip";
import React from "react";
import { useEvaluationDataStore } from "../_store/useStore";
import { Icon } from "@iconify/react/dist/iconify.js";

function ProfileCard({ user }: { user: Employee }) {
    return (
        <div className="flex w-[400px] items-start justify-evenly gap-4 rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            <div className="flex h-full flex-col items-center justify-center gap-2">
                <Chip
                    variant={"background"}
                    className="font-mono text-xs font-bold text-zinc-800"
                >
                    {user.matricule}
                </Chip>
                <div className="te flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-white">
                    {user.firstName && user.lastName
                        ? user.lastName.charAt(0) + user.firstName.charAt(0)
                        : ""}
                </div>
            </div>
            <div className="flex h-full flex-col items-start justify-evenly">
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        NAME
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {user.firstName && user.lastName
                            ? user.lastName + " " + user.firstName.split(" ")[0]
                            : ""}
                    </p>
                </div>
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        Position
                    </p>
                    <p className="w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold text-zinc-700">
                        {user.jobTitle ?? "..."}
                    </p>
                </div>
            </div>
            <div className="flex h-full flex-col items-start justify-evenly">
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        SUPERVISOR (N+1)
                    </p>
                    <p className="whitespace-nowrap text-xs font-bold text-zinc-700">
                        {user.supervisor
                            ? user.supervisor.lastName +
                              " " +
                              user.supervisor.firstName.split(" ")[0]
                            : "..."}
                    </p>
                </div>
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        SUPERVISOR (N+2)
                    </p>
                    <p className="whitespace-nowrap text-xs font-bold text-zinc-700">
                        {user.supervisor && user.supervisor.supervisor
                            ? user.supervisor.supervisor.lastName +
                              " " +
                              user.supervisor.supervisor.firstName.split(" ")[0]
                            : "..."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
