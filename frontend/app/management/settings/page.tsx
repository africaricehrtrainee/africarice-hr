"use client";
import { Schedule } from "@/app/objectives/[userId]/page";
import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import Step from "./_components/Step";

function Settings() {
    return (
        <main className="flex h-full w-full flex-1 items-center justify-center gap-4 p-8">
            <EvaluationSettings />
        </main>
    );
}

function EvaluationSettings() {
    const [steps, setSteps] = useState<Step[]>([]);

    async function fetchStep() {
        axios
            .get<Step[]>(process.env.NEXT_PUBLIC_API_URL + "/api/steps/", {})
            .then((response) => {
                if (response.data) {
                    console.log("steps", response.data);
                    setSteps(response.data);
                } else {
                    setSteps([]);
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetchStep();
    }, []);

    if (!steps) return;
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
                    Evaluation steps
                </p>
            </div>
            <div className="mt-2 flex w-full flex-col items-start justify-start gap-1">
                {steps.map((step, i) => {
                    return <Step key={i} step={step} fetchStep={fetchStep} />;
                })}
            </div>
        </div>
    );
}

export default Settings;
