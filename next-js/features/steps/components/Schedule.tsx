"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import { useObjectivesDataStore } from "../../../app/objectives/[userId]/_store/useStore";
import { useToast } from "@/components/ui/use-toast";
import { useQueryState } from "nuqs";
import { getYear } from "date-fns";
import { Step } from "./Step";
import StepTutorial from "./StepTutorial";
import { useAuth } from "@/hooks/useAuth";

export function Schedule({
    fetch,
    edit,
}: {
    fetch: () => any;
    edit?: boolean;
}) {
    const data = useObjectivesDataStore();
    const [year, setYear] = useQueryState("year");
    const { user } = useAuth()
    const [isWatching, setIsWatching] = useState<boolean>(false);

    const { toast } = useToast();

    const [currentStepIndex] = useQueryState<number>("step", {
        defaultValue: 0,
        parse: (value) => parseInt(value),
    });
    const postSteps = async (index: number) => {
        const id = data.evaluationSteps[index].stepId;
        await axios
            .put(`${process.env.NEXT_PUBLIC_API_URL}/api/steps/${id}/current`)
            .then((response) => {
                if (response.status == 200) {
                    fetch();
                    toast({
                        description: "Updated successfully",
                    });
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="flex w-full flex-1 items-start justify-between gap-1 rounded-md border border-zinc-200 bg-white p-4 text-center shadow-sm transition-all">
            <div className="flex max-w-md xl:max-w-3xl flex-col items-start justify-start gap-2 rounded-md border border-zinc-100 bg-zinc-50 p-4 text-start">
                <p className="flex items-center justify-center gap-2 border-b border-b-zinc-200 pb-1 text-sm font-medium">
                    {data.evaluationSteps[currentStepIndex].name}
                    <Icon
                        icon="bi:star-fill"
                        className="text-green-500"
                        fontSize={12}
                    />
                </p>
                <div className="flex flex-col xl:flex-row w-full gap-2">
                    <p className="pb-2 rounded-md text-sm text-muted-foreground border-b border-dashed border-b-zinc-400 xl:border-b-0 xl:border-r xl:border-r-zinc-400 xl:pb-0 xl:pr-1">
                        {data.evaluationSteps[currentStepIndex].message}
                    </p>
                    <p className="rounded-md text-sm text-muted-foreground">
                        {data.evaluationSteps[currentStepIndex].messageFr}
                    </p>
                </div>
                {/* <Button
                    variant="outline"
                    className="bg-white"
                    onClick={() => setIsWatching(true)}
                >
                    Watch how-to
                    <Icon
                        icon="bi:play-circle"
                        className="ml-1 text-zinc-500"
                        fontSize={12}
                    />
                </Button> */}
                <Modal show={isWatching} onClose={() => setIsWatching(false)}>
                    <StepTutorial onClose={() => setIsWatching(false)} />
                </Modal>
            </div>
            <div className="flex flex-col items-end justify-start gap-2">
                <div className="flex w-full items-center justify-start gap-2 rounded-md bg-zinc-100 p-1">
                    {data.evaluationSteps
                        .sort((a, b) => a.stepId - b.stepId)
                        .map((stepObj, index) => {
                            if (data.employee?.supervisorId == user?.employeeId && index == 0) return;
                            else if (data.employee?.employeeId == user?.employeeId && index == 1) return;
                            return (

                                <>
                                    <Step
                                        key={stepObj.name}
                                        step={stepObj}
                                        postSteps={postSteps}
                                        index={index as number}
                                    />
                                    {/* {index < data.evaluationSteps.length - 1 && (
                        <>
                            <div
                                className={
                                    "h-2 w-2 rounded-full" +
                                    (activeStep > index
                                        ? " bg-zinc-300"
                                        : " bg-zinc-100")
                                }
                            ></div>
                        </>
                    )} */}
                                </>
                            )
                        })}
                </div>
            </div>
        </div>
    );
}
