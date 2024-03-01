import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useState } from "react";

export default function Step({
    step,
    fetchStep,
}: {
    step: Step;
    fetchStep: () => void;
}): React.JSX.Element {
    function handleUpdate(e: React.SyntheticEvent) {
        {
            e.preventDefault();
            if (
                dateFrom &&
                dateTo &&
                confirm("Do you want to update this step ?")
            ) {
                axios
                    .put(
                        process.env.NEXT_PUBLIC_API_URL +
                            "/api/steps/" +
                            step.stepId,
                        {
                            step: {
                                dateFrom,
                                dateTo,
                            },
                        }
                    )
                    .then((response) => response.status == 200 && fetchStep())
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }

    const [name, setName] = useState<string>(step.name);
    const [stepId, setStepId] = useState<number>(step.stepId);
    const [dateFrom, setDateFrom] = useState<string>(step.dateFrom);
    const [dateTo, setDateTo] = useState<string>(step.dateTo);
    const [message, setMessage] = useState<string>(step.message);
    return (
        <div className="my-2 w-full border-b border-b-zinc-100 pb-2">
            <p className="text-sm font-bold text-zinc-700">{step.name}</p>
            <form
                className="flex w-full items-end justify-start gap-2"
                onSubmit={handleUpdate}
            >
                <div className="mt-2 flex w-[150px] flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        EVALUATION STARTING DATE
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="date"
                        onClick={(e) => {
                            e.currentTarget.showPicker();
                        }}
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        placeholder="Pick the step starting date"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>

                <div className="mt-2 flex w-[150px] flex-col justify-start gap-1">
                    <label className="text-[8px] font-medium text-zinc-300">
                        EVALUATION ENDING DATE
                    </label>
                    <input
                        autoCorrect="off"
                        spellCheck="false"
                        type="date"
                        value={dateTo}
                        onClick={(e) => {
                            e.currentTarget.showPicker();
                        }}
                        min={dateFrom}
                        onChange={(e) => setDateTo(e.target.value)}
                        placeholder="Pick the evaluation step deadline"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                </div>

                <div className="mt-2 flex w-full flex-col items-start justify-start gap-2">
                    <Button
                        type="submit"
                        disabled={
                            !(
                                JSON.stringify([
                                    name,
                                    dateFrom,
                                    dateTo,
                                    message,
                                ]) !==
                                JSON.stringify([
                                    step.name,
                                    step.dateFrom,
                                    step.dateTo,
                                    step.message,
                                ])
                            )
                        }
                        variant="primary"
                    >
                        Save changes
                        <Icon
                            icon="mdi:check-all"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                </div>
            </form>
        </div>
    );
}
