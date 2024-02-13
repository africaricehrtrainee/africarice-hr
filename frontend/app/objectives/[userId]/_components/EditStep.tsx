import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState, useRef } from "react";
import Button from "../../../../components/ui/Button";
import axios from "axios";
import { cn } from "@/util/utils";
import LoadingBar from "react-top-loading-bar";

interface EditStepProps {
    step: Step;
    onFormSubmit: (success: boolean) => any; // Adjust the type as per your actual employee data structure
}
const EditStep: React.FC<EditStepProps> = ({ step, onFormSubmit }) => {
    function handleUpdate(e: React.SyntheticEvent) {
        {
            e.preventDefault();
            if (
                name &&
                message &&
                deadline &&
                confirm("Do you want to update this step ?")
            ) {
                axios
                    .put(
                        process.env.NEXT_PUBLIC_API_URL +
                            "/api/steps/" +
                            step.stepId,
                        {
                            name,
                            message,
                            deadline,
                        }
                    )
                    .then((response) =>
                        response.status == 200
                            ? onFormSubmit(true)
                            : onFormSubmit(false)
                    )
                    .catch((err) => {
                        onFormSubmit(false);
                        console.log(err);
                    });
            }
        }
    }

    const [stepId, setStepId] = useState<number>(step.stepId);
    const [name, setName] = useState<string>(step.name);
    const [deadline, setDeadLine] = useState<string>(step.dateFrom);
    const [message, setMessage] = useState<string>(step.message);

    return (
        <div className="flex w-[500px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-700">
                Evaluation
                <Icon
                    icon="fluent:board-16-filled"
                    className="ml-1"
                    fontSize={10}
                />
            </div>
            <div className="mt-2 flex w-full items-center justify-between">
                <p className="text-2xl font-bold text-zinc-700">{name}</p>
            </div>
            <form className="w-full" onSubmit={handleUpdate}>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        EVALUATION STEP NAME
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter the evaluation step name"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        EVALUATION STEP DEADLINE
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadLine(e.target.value)}
                        placeholder="Pick the evaluation step deadline"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>
                <div className="mt-4 flex w-full flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        EVALUATION STEP MESSAGE
                    </label>
                    <textarea
                        autoCorrect="off"
                        spellCheck="false"
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter the message that will be sent for this evaluation step"
                        className="h-32 w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>

                <div className="mt-4 flex w-full flex-col items-start justify-start gap-2">
                    <Button
                        type="submit"
                        disabled={
                            !(
                                JSON.stringify([name, deadline, message]) !==
                                JSON.stringify([
                                    step.name,
                                    step.dateFrom,
                                    step.message,
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

export default EditStep;
