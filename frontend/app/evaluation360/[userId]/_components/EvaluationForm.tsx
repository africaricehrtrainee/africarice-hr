import Chip from "@/components/ui/Chip";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useEvaluationDataStore } from "../_store/useStore";
import { set } from "date-fns";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Button from "@/components/ui/Button";

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
            <div className="relative flex max-w-[500px] flex-1 flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm">
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
                <Chip variant="primary">
                    Evaluation Form
                    <Icon
                        icon="subway:write-1"
                        className="ml-1"
                        fontSize={14}
                    />
                </Chip>
                {!evaluation.evaluatorGrade || !evaluation.evaluatorComment ? (
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
            <Chip variant="background">
                Leave a rating of this staff member.
                <Icon
                    icon="clarity:info-solid"
                    className="ml-1"
                    fontSize={14}
                />
            </Chip>
        </div>
    );
}

function EvaluationInput({ evaluation }: { evaluation: Evaluator360 }) {
    const { user } = useAuth();
    const data = useEvaluationDataStore();

    const [grade, setGrade] = useState<number>(evaluation.evaluatorGrade);
    const [comment, setComment] = useState<string>(evaluation.evaluatorComment);
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    async function updateEvaluator360() {
        try {
            if (
                grade &&
                comment &&
                data.evaluation &&
                data.evaluation.evaluation360Id
            ) {
                const id = data.evaluation.evaluation360Id;
                setLoading(true);
                const result = await axios
                    .put(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/evaluator360/${evaluation.evaluator360Id}`,
                        {
                            evaluation: {
                                evaluatorGrade: grade,
                                evaluatorComment: comment,
                            },
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
    return (
        <form action={updateEvaluator360} className="mt-4 w-full">
            <div className="flex w-full flex-col items-start justify-start gap-2">
                <label className="text-[10px] font-medium text-zinc-300">
                    OVERALL STAFF GRADE
                    <span className="text-[8px] text-brand">* (required)</span>
                </label>
                <div className="flex w-full items-center justify-center gap-1">
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            !!evaluation.evaluatorGrade ||
                            !!evaluation.evaluatorComment
                        }
                        onClick={() => {
                            setGrade(1);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                                grade == 1
                                    ? "bg-green-400 text-green-50 border-transparent"
                                    : " text-green-500 bg-transparent border-green-300"
                            }`
                        }
                    >
                        1
                    </button>
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            !!evaluation.evaluatorGrade ||
                            !!evaluation.evaluatorComment
                        }
                        onClick={() => {
                            setGrade(2);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                                grade == 2
                                    ? "bg-green-400 text-green-50 border-transparent"
                                    : " text-green-500 bg-transparent border-green-300"
                            }`
                        }
                    >
                        2
                    </button>
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            !!evaluation.evaluatorGrade ||
                            !!evaluation.evaluatorComment
                        }
                        onClick={() => {
                            setGrade(3);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                                grade == 3
                                    ? "bg-green-400 text-green-50 border-transparent"
                                    : " text-green-500 bg-transparent border-green-300"
                            }`
                        }
                    >
                        3
                    </button>
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            !!evaluation.evaluatorGrade ||
                            !!evaluation.evaluatorComment
                        }
                        onClick={() => {
                            setGrade(4);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                                grade == 4
                                    ? "bg-green-400 text-green-50 border-transparent"
                                    : " text-green-500 bg-transparent border-green-300"
                            }`
                        }
                    >
                        4
                    </button>
                    <button
                        type="button"
                        disabled={
                            user?.employeeId != evaluation.evaluatorId ||
                            !!evaluation.evaluatorGrade ||
                            !!evaluation.evaluatorComment
                        }
                        onClick={() => {
                            setGrade(5);
                        }}
                        className={
                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                            ` ${
                                grade == 5
                                    ? "bg-green-400 text-green-50 border-transparent"
                                    : " text-green-500 bg-transparent border-green-300"
                            }`
                        }
                    >
                        5
                    </button>
                </div>
                <label className="text-[10px] font-medium text-zinc-300">
                    GENERAL COMMENTS
                    <span className="text-[8px] text-brand">* (required)</span>
                </label>
                <textarea
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={
                        user?.employeeId != evaluation.evaluatorId ||
                        !!evaluation.evaluatorGrade ||
                        !!evaluation.evaluatorComment
                    }
                    value={comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setComment(e.target.value);
                    }}
                    placeholder={`Write your evaluation for this staff member`}
                    className="h-[150px] w-full rounded-md border border-zinc-200 p-2 px-3 text-start text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                />
                {user?.employeeId == evaluation.evaluatorId && (
                    <Button
                        variant="primary"
                        loading={loading}
                        disabled={
                            !grade ||
                            !comment ||
                            !!evaluation.evaluatorGrade ||
                            !!evaluation.evaluatorComment
                        }
                        type="submit"
                        className="mt-4"
                    >
                        Submit evaluation
                        <Icon
                            icon="mdi:check-all"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                )}
            </div>
        </form>
    );
}
export default EvaluationForm;
