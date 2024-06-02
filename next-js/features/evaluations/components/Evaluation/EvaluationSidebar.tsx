import Chip from "@/components/ui/Chip";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useObjectivesDataStore } from "../../../../app/objectives/[userId]/_store/useStore";
import { useQueryState } from "nuqs";
import { cn } from "@/util/utils";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useGetSettings } from "@/features/settings/queries";

function EvaluationSidebar() {
    const { objectives, evaluation } = useObjectivesDataStore();
    return (
        <div className="relative flex h-fit w-[450px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white shadow-sm transition-all">
            {objectives &&
                objectives?.filter((obj) => obj.status !== "cancelled")
                    .length >= 3 &&
                objectives?.every((obj) => obj.evaluationStatus == "sent") &&
                evaluation?.evaluationStatus == "sent" && (
                    <GradeHeader
                        objectives={objectives}
                        evaluation={evaluation}
                    />
                )}
            {objectives &&
                objectives?.filter((obj) => obj.status == "ok").length > 0 && (
                    <ObjectiveComponent />
                )}
            <EvaluationComponent />
        </div>
    );
}
function GradeHeader({
    objectives,
    evaluation,
}: {
    objectives: Objective[];
    evaluation: Evaluation;
}) {
    const objectivesGrade =
        objectives.reduce((acc, obj) => acc + (obj.grade ?? 0), 0) /
        objectives.length;

    const evaluationGrade =
        Math.round(
            (((evaluation.respectRating ?? 0) +
                (evaluation.efficiencyRating ?? 0) +
                (evaluation.commitmentRating ?? 0) +
                (evaluation.initiativeRating ?? 0) +
                (evaluation.leadershipRating ?? 0) +
                (evaluation.competencyRating ?? 0)) /
                (evaluation.leadershipRating ? 6 : 5)) *
            100
        ) / 100;

    const totalGrade = (objectivesGrade + evaluationGrade) / 2;
    if (!evaluation.overallRating) return;
    return (
        <div className="w-full flex flex-col border-b border-b-zinc-100 p-4">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-start">
                    <h1 className="text-lg font-bold text-zinc-700">Overall grade</h1>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <Icon
                        icon="mdi:star"
                        className="text-yellow-500"
                        fontSize={20}
                    />
                    <p className="text-2xl font-bold text-zinc-700">
                        {Math.round(evaluation.overallRating * 100) / 100}
                        <span className="text-xs font-bold text-zinc-400">/5</span>
                    </p>
                </div>
            </div>
            {/* <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-start">
                    <h1 className="text-sm font-semibold text-zinc-600">Competency & Objectives grade</h1>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <Icon
                        icon="mdi:star"
                        className="text-yellow-500"
                        fontSize={20}
                    />
                    <p className="text-lg font-bold text-zinc-700">
                        {Math.round(totalGrade * 100) / 100}
                        <span className="text-xs font-bold text-zinc-400">/5</span>
                    </p>
                </div>
            </div> */}
        </div>
    );
}


function EvaluationComponent() {
    const {
        employee,
        setSelectedObjectiveIndex,
        selectedObjectiveIndex,
        evaluation,
    } = useObjectivesDataStore();

    const [step, setStep] = useQueryState<number>("step", {
        defaultValue: 0,
        parse: (value) => parseInt(value),
    });

    const { user } = useAuth();
    const isEmployee = user?.employeeId == employee?.employeeId;

    const status =
        isEmployee
            ? evaluation?.selfEvaluationStatus
            : evaluation?.evaluationStatus;
    const title = "Competency & Overall Evaluation"
    const label = isEmployee ? "Submitted" : "Evaluated";
    return (
        <div className="flex w-full flex-col items-start justify-start">
            <div className="flex w-full justify-between p-4">
                {status !== "sent" && (
                    <Chip variant="alert" className="rounded-lg">
                        1 {title?.toLowerCase()} left to submit
                        <Icon icon="mdi:alert" className="ml-1" fontSize={12} />
                    </Chip>
                )}
                {status == "sent" && (
                    <Chip variant="brand" className="rounded-lg">
                        General {title.toLowerCase()} completed
                        <Icon
                            icon="mdi:check-all"
                            className="ml-1"
                            fontSize={12}
                        />
                    </Chip>
                )}
            </div>
            <button
                onClick={() => setSelectedObjectiveIndex(-1)}
                className={cn(
                    "flex w-full  relative items-between justify-between border-b border-t border-b-zinc-100 border-t-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50",
                    {
                        "bg-zinc-50 border-l-4 border-l-green-300":
                            selectedObjectiveIndex === -1,
                    }
                )}
            >
                <div className="flex flex-col items-start justify-start">
                    {(status == "draft" || !status) && (
                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[10px] font-semibold text-zinc-700">
                            Draft
                            <Icon
                                icon="octicon:issue-draft-16"
                                className="ml-1"
                                fontSize={10}
                            />
                        </div>
                    )}
                    {status == "sent" && (
                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[10px] font-semibold text-blue-500">
                            {label}
                            <Icon
                                icon="mdi:check-all"
                                className="ml-1"
                                fontSize={10}
                            />
                        </div>
                    )}
                    <p className="mt-2 text-[8px] font-medium text-zinc-300">
                        EVALUATION SECTION
                    </p>
                    <p className="w-[200px] truncate text-start text-xs font-bold text-zinc-700">
                        {title}
                    </p>
                </div>
                {evaluation &&
                    evaluation.evaluationStatus == "sent" &&
                    step == 3 && (
                        <div className="flex flex-col items-end justify-center rounded-md border border-zinc-100 p-2 text-end">
                            <p className="text-[10px] font-bold text-zinc-400">
                                Competency grade
                            </p>
                            <p className="text-2xl font-bold text-zinc-700">
                                {Math.round(
                                    (((evaluation.respectRating ?? 0) +
                                        (evaluation.efficiencyRating ?? 0) +
                                        (evaluation.commitmentRating ?? 0) +
                                        (evaluation.initiativeRating ?? 0) +
                                        (evaluation.leadershipRating ?? 0) +
                                        (evaluation.competencyRating ?? 0)) /
                                        (evaluation.leadershipRating ? 6 : 5)) *
                                    100
                                ) / 100}
                                <span className="text-xs font-bold text-zinc-400">
                                    /5
                                </span>
                            </p>
                        </div>
                    )}
            </button>
        </div>
    );
}

function ObjectiveComponent() {
    const { user } = useAuth()
    const {
        objectives,
        setSelectedObjectiveIndex,
        selectedObjectiveIndex,
        employee,
        fetchObjectives,
    } = useObjectivesDataStore();

    const [step, setStep] = useQueryState<number>("step", {
        defaultValue: 0,
        parse: (value) => parseInt(value),
    });

    const [year, setYear] = useQueryState<number>("year", {
        defaultValue: new Date().getFullYear(),
        parse: (value) => parseInt(value),
    });

    const { data: settings } = useGetSettings()

    async function saveObjectives(objectives: Partial<Objective>[]) {
        if (!employee || !year) return;

        axios.post(
            process.env.NEXT_PUBLIC_API_URL + "/api/objectives/bulk",
            {
                objectives,
            }
        ).then(
            (response) => {
                if (response.status == 201) {
                    fetchObjectives(employee.employeeId.toString(), year.toString());
                    toast({
                        description: "Successfully updated objectives",
                    });
                }
            }


        ).catch((err) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });
            console.log(err);
        });
    }

    const isEmployee = user?.employeeId == employee?.employeeId;
    const filteredObjectives = objectives?.filter((obj) => obj.status !== "cancelled" && obj.status !== "draft")
    const count =
        isEmployee
            ? filteredObjectives?.filter((obj) => obj.selfEvaluationStatus == "draft")
                .length
            : filteredObjectives?.filter((obj) => obj.evaluationStatus == "draft")
                .length;
    const title = isEmployee ? "Self-Evaluation" : "Evaluation";
    const label = isEmployee ? "Submitted" : "Evaluated";

    if (!settings || !filteredObjectives) return;
    return (
        <div className="flex w-full flex-col items-start justify-start pb-8">
            <div className="flex w-full justify-between p-4">
                {count && count > 0 ? (
                    <Chip variant="alert" className="rounded-lg">
                        {count} objective(s) left to review
                        <Icon icon="mdi:alert" className="ml-1" fontSize={12} />
                    </Chip>
                ) : (
                    <Chip variant="brand" className="rounded-lg">
                        Objectives {title.toLowerCase()} completed
                        <Icon
                            icon="mdi:check-all"
                            className="ml-1"
                            fontSize={12}
                        />
                    </Chip>
                )}
            </div>
            <div className="flex w-full flex-col justify-start">
                {objectives?.map((objective, index) => {
                    const status =
                        isEmployee
                            ? objective?.selfEvaluationStatus
                            : objective?.evaluationStatus;
                    if (objective.status !== "ok") return null;
                    return (
                        <>
                            <button
                                key={index}
                                onClick={() => setSelectedObjectiveIndex(index)}
                                className={cn(
                                    "flex w-fullrelative items-between justify-between border-t border-b-zinc-100 border-t-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50",
                                    {
                                        "bg-zinc-50 border-l-4 border-l-green-300":
                                            selectedObjectiveIndex === index,
                                    }
                                )}
                            >
                                <div className="flex flex-col items-start justify-start">
                                    {(status == "draft" || !status) && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[10px] font-semibold text-zinc-700">
                                            Draft
                                            <Icon
                                                icon="octicon:issue-draft-16"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    {status == "sent" && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[10px] font-semibold text-blue-500">
                                            {label}
                                            <Icon
                                                icon="mdi:check-all"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    <p className="mt-2 text-[8px] font-medium text-zinc-300">
                                        EVALUATION SECTION
                                    </p>
                                    <p className="w-[200px] truncate text-start text-xs font-bold text-zinc-700">
                                        {objective.title ?? "Untitled"}
                                    </p>
                                </div>
                                {objective.grade && step == 3 && objective.evaluationStatus == "sent" && (
                                    <div className="flex flex-col items-end justify-center rounded-md border border-zinc-100 p-2 text-end">
                                        <p className="text-[10px] font-bold text-zinc-400">
                                            Objective grade
                                        </p>
                                        <p className="text-2xl font-bold text-zinc-700">
                                            {objective.grade}
                                            <span className="text-xs font-bold text-zinc-400">
                                                /5
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </button>
                        </>
                    );
                })}
            </div>
            <div className="mt-4 flex w-full items-center justify-center">
                {user?.employeeId == employee?.employeeId && <Button
                    className=""
                    disabled={!objectives || filteredObjectives.every((obj) => obj.selfEvaluationStatus == "sent") || filteredObjectives.some((obj) => !obj.selfComment || obj.selfComment.length < parseInt(settings.SETTING_MIN_CHAR))}
                    onClick={() => {
                        if (!objectives) return;

                        const temp = [...objectives];
                        temp.forEach((obj, i, arr) => {
                            arr[i].selfEvaluationStatus = "sent";
                        });

                        saveObjectives(temp)
                    }}
                    variant="primary"
                >
                    Submit my evaluations
                    <Icon
                        icon="material-symbols:upload"
                        className="ml-1"
                        fontSize={14}
                    />
                </Button>}
                {user?.employeeId == employee?.supervisorId && <Button
                    className=""
                    disabled={!objectives || filteredObjectives.every((obj) => obj.evaluationStatus == "sent") || filteredObjectives.some((obj) => !obj.comment || !obj.grade)}
                    onClick={() => {
                        if (!objectives) return;

                        const temp = [...objectives];
                        temp.forEach((obj, i, arr) => {
                            arr[i].evaluationStatus = "sent";
                        });

                        saveObjectives(temp)
                    }}
                    variant="primary"
                >
                    Submit my evaluations
                    <Icon
                        icon="material-symbols:upload"
                        className="ml-1"
                        fontSize={14}
                    />
                </Button>}

            </div>
        </div>
    );
}

export default EvaluationSidebar;
