import Chip from "@/components/ui/Chip";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useEvaluationDataStore } from "../_store/useStore";
import { set } from "date-fns";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Button from "@/components/ui/Button";
import { cn } from "@/util/utils";
import { useGetSettings } from "@/features/settings/queries";

function EvaluationForm() {
    const { user } = useAuth();

    const { evaluators, selectedEmployeeId, employee } =
        useEvaluationDataStore();
    const evaluation = evaluators?.find(
        (obj) => obj.evaluatorId == selectedEmployeeId
    );

    if (
        (user?.employeeId == selectedEmployeeId ||
            user?.employeeId == employee?.supervisorId) &&
        evaluation
    )
        return (
            <div className="relative flex max-w-[700px] flex-1 flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm">
                <EvaluationHeader evaluation={evaluation} />
                <EvaluationInput evaluation={evaluation} />
            </div>
        );
}

function EvaluationHeader({ evaluation }: { evaluation: Evaluator360 }) {
    const { employee } = useEvaluationDataStore();
    return (
        <div className="flex w-full flex-col items-start justify-start gap-2">
            <div className="flex w-full items-center justify-between">
                <Chip variant="background">
                    Form
                    <Icon
                        icon="subway:write-1"
                        className="ml-1"
                        fontSize={14}
                    />
                </Chip>
                {evaluation.evaluatorStatus !== "evaluated" ? (
                    <Chip variant="primary">
                        Unsubmitted
                        <Icon
                            icon="ph:circle-dashed"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Chip>
                ) : (
                    <Chip variant="brand">
                        Sent
                        <Icon
                            icon="mdi:check-all"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Chip>
                )}
            </div>
            <p className="text-xl font-bold text-zinc-700">
                {employee?.firstName.split(" ")[0]}&apos;s evaluation
            </p>
        </div>
    );
}

function EvaluationInput({ evaluation }: { evaluation: Evaluator360 }) {
    const { user } = useAuth();
    const data = useEvaluationDataStore();
    const [form, setForm] = useState<Evaluator360>(evaluation);
    const [index, setIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const { data: settings } = useGetSettings()

    const fields = [
        {
            key: "questionOne",
            rating: "ratingOne",
        },
        {
            key: "questionTwo",
            rating: "ratingTwo",
        },
        {
            key: "questionThree",
            rating: "ratingThree",
        },
        {
            key: "questionFour",
            rating: "ratingFour",
        },
        {
            key: "questionFive",
            rating: "ratingFive",
        },
    ];

    async function updateEvaluator360(evaluator: Evaluator360) {
        try {
            if (form && data.evaluation && data.evaluation.evaluation360Id) {
                const id = data.evaluation.evaluation360Id;
                setLoading(true);
                const result = await axios
                    .put(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/evaluator360/${evaluation.evaluator360Id}`,
                        {
                            evaluator,
                        }
                    )
                    .then((res) => {
                        if (res.status == 200) {
                            data.fetchEvaluators(id.toString());
                            toast({
                                title: "Evaluation Sent!",
                                description:
                                    "Successfully sent your evaluation!",
                            });
                            return true;
                        }
                    })
                    .catch((err) => {
                        toast({
                            variant: "destructive",
                            title: "Oops!",
                            description: "Failed to send your evaluation!",
                        });
                        console.log(err);
                        return false;
                    })
                    .finally(() => {
                        setLoading(false);
                    });

                return result;
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setForm(evaluation);
    }, [evaluation]);

    if (!settings) return;
    return (
        <div className="w-full">
            <div className="mt-1 flex w-full flex-col items-start justify-start gap-2">
                <div className="flex w-full items-start justify-start gap-1">
                    {fields.map((field, i) => {
                        return (
                            <Button
                                onClick={() => setIndex(i)}
                                variant={"outline"}
                                disabled={index == i}
                                type="button"
                                key={i}
                                className={cn("relative flex items-center justify-center p-1 px-2 text-xs font-medium",
                                    // @ts-ignore
                                    !form[field.key] || !form[field.rating] ? "border-b-2 border-b-red-500" : "border-b-2 border-b-green-500"
                                )}
                            >
                                Section {i + 1}
                            </Button>
                        );
                    })}
                </div>
                <label className="mt-3 text-[10px] font-medium text-zinc-300">
                    EVALUATION SECTION QUESTION
                </label>
                <div className="flex w-full items-center justify-start gap-8">
                    <p className="text-sm font-medium text-zinc-700">
                        {/* @ts-ignore */}
                        {settings["EVALUATION_QUESTION_" + (index + 1)]}
                    </p>
                </div>
                <label className="text-[10px] flex gap-2 items-center font-medium text-zinc-300">
                    EVALUATION COMMENT
                    {/* @ts-ignore */}
                    {form[fields[index]["key"]] && form[fields[index]["key"]].length < settings.SETTING_MIN_CHAR && <Chip variant="alert" className="p-1 px-2 rounded-md">
                        {/* @ts-ignore */}
                        {settings?.SETTING_MIN_CHAR - form[fields[index]["key"]].length} characters left
                    </Chip>}
                </label>
                <div className="flex w-full items-center justify-center gap-1">
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            evaluation.evaluatorStatus == "evaluated"
                        }
                        onClick={() => {
                            const f = { ...form };
                            // @ts-ignore
                            f[fields[index].rating] = 1;
                            setForm(f);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                            // @ts-ignore
                            form[fields[index].rating] == 1
                                ? "bg-green-400 text-green-50 border-transparent"
                                : " text-green-500 bg-green-50 border-green-300"
                            }`
                        }
                    >
                        Very Negative
                    </button>
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            evaluation.evaluatorStatus == "evaluated"
                        }
                        onClick={() => {
                            const f = { ...form };
                            // @ts-ignore
                            f[fields[index].rating] = 2;
                            setForm(f);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                            // @ts-ignore
                            form[fields[index].rating] == 2
                                ? "bg-green-400 text-green-50 border-transparent"
                                : " text-green-500 bg-green-50 border-green-300"
                            }`
                        }
                    >
                        Negative
                    </button>
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            evaluation.evaluatorStatus == "evaluated"
                        }
                        onClick={() => {
                            const f = { ...form };
                            // @ts-ignore
                            f[fields[index].rating] = 3;
                            setForm(f);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                            // @ts-ignore
                            form[fields[index].rating] == 3
                                ? "bg-green-400 text-green-50 border-transparent"
                                : " text-green-500 bg-green-50 border-green-300"
                            }`
                        }
                    >
                        Neutral
                    </button>
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            evaluation.evaluatorStatus == "evaluated"
                        }
                        onClick={() => {
                            const f = { ...form };
                            // @ts-ignore
                            f[fields[index].rating] = 4;
                            setForm(f);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                            // @ts-ignore
                            form[fields[index].rating] == 4
                                ? "bg-green-400 text-green-50 border-transparent"
                                : " text-green-500 bg-green-50 border-green-300"
                            }`
                        }
                    >
                        Positive
                    </button>
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            evaluation.evaluatorStatus == "evaluated"
                        }
                        onClick={() => {
                            const f = { ...form };
                            // @ts-ignore
                            f[fields[index].rating] = 5;
                            setForm(f);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                            // @ts-ignore
                            form[fields[index].rating] == 5
                                ? "bg-green-400 text-green-50 border-transparent"
                                : " text-green-500 bg-green-50 border-green-300"
                            }`
                        }
                    >
                        Very Positive
                    </button>
                </div>
                <textarea
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={
                        user?.employeeId != evaluation.evaluatorId ||
                        evaluation.evaluatorStatus == "evaluated"
                    }
                    // @ts-ignore
                    value={form[fields[index]["key"]] ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const f = { ...form };
                        // @ts-ignore
                        f[fields[index].key] = e.target.value;
                        setForm(f);
                    }}
                    placeholder={`Answer this question for this staff member`}
                    className="h-[150px] w-full rounded-md border border-zinc-200 p-2 px-3 text-start text-sm font-medium outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                />
                <div className="mt-4 flex w-full items-center justify-between">
                    <div className="flex items-center justify-center gap-1">
                        <Button
                            onClick={() => {
                                setIndex(index - 1);
                            }}
                            disabled={index == 0}
                            variant="outline"
                            type="button"
                        >
                            <Icon icon="mdi:arrow-left" fontSize={14} />
                            Previous
                        </Button>
                        <Button
                            type="button"
                            disabled={index == 4}
                            onClick={() => {
                                setIndex(index + 1);
                            }}
                            variant="outline"
                        >
                            Next
                            <Icon icon="mdi:arrow-right" fontSize={14} />
                        </Button>
                    </div>
                    {user?.employeeId == evaluation.evaluatorId && (
                        <div className="flex items-start justify-end gap-1">
                            <Button
                                onClick={() => {
                                    updateEvaluator360(form);
                                }}
                                variant="outline"
                                disabled={
                                    JSON.stringify(form) ===
                                    JSON.stringify(evaluation)
                                }
                                type="button"
                            >
                                Save for later
                                <Icon
                                    icon="material-symbols:download"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    const f = { ...form };
                                    f.evaluatorStatus = "evaluated";
                                    updateEvaluator360(f);
                                }}
                                loading={loading}
                                disabled={
                                    fields.some(
                                        (field) =>
                                            // @ts-ignore
                                            !form[field.key] || (form[field.key].length < settings?.SETTING_MIN_CHAR) || !form[field.rating]

                                    ) ||
                                    form.evaluatorStatus == "evaluated"
                                }
                                type="button"
                            >
                                Submit evaluation
                                <Icon
                                    icon="mdi:check-all"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default EvaluationForm;
