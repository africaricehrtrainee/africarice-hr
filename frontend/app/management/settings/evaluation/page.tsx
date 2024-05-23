
"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import Step from "../_components/Step";
import { useGetSettings } from "@/features/settings/queries";
import Questions from "../_components/Questions";

function Settings() {
    return (
        <EvaluationSettings />
    );
}

function EvaluationSettings() {
    const [steps, setSteps] = useState<Step[]>([]);
    const { data: settings } = useGetSettings()

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

    if (!steps || !settings) return;
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
                    Evaluation deadlines
                </p>
            </div>
            <div className="mt-2 flex w-full flex-col items-start justify-start gap-1">
                {steps.map((step, i) => {
                    return <Step key={i} step={step} fetchStep={fetchStep} />;
                })}
            </div>
            <div className="mt-8 flex-col flex w-full items-start justify-start">
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-700">
                    Dashboard
                    <Icon
                        icon="fluent:board-16-filled"
                        className="ml-1"
                        fontSize={10}
                    />
                </div>
                <p className="text-2xl font-bold text-zinc-700">
                    Evaluation settings
                </p>
                <Questions questions={Object.entries(settings).map(
                    ([name, value]) => {
                        return { name, value };
                    }
                )} />
            </div>
        </div>
    );
}

export default Settings;