import Chip from "@/components/ui/Chip";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useObjectivesDataStore } from "../../_store/useStore";
import { cn } from "@/lib/utils";

function EvaluationSidebar() {
    const { objectives } = useObjectivesDataStore();
    return (
        <div className="relative flex h-fit w-[450px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white shadow-sm transition-all">
            <EvaluationComponent />
            {objectives &&
                objectives?.filter((obj) => obj.status == "ok").length > 0 && (
                    <ObjectiveComponent />
                )}
        </div>
    );
}

function EvaluationComponent() {
    const {
        employee,
        setSelectedObjectiveIndex,
        selectedObjectiveIndex,
        evaluation,
        selectedEvaluationStep,
    } = useObjectivesDataStore();

    const status =
        selectedEvaluationStep == 2
            ? evaluation?.selfEvaluationStatus
            : evaluation?.evaluationStatus;
    const title =
        selectedEvaluationStep == 2 ? "Self-Evaluation" : "Evaluation";
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
                    "flex w-full relative items-between justify-start border-b border-t border-b-zinc-100 border-t-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50",
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
                            Submitted
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
                    selectedEvaluationStep == 3 && (
                        <div className="flex flex-col items-end justify-center rounded-md border border-zinc-100 p-2 text-end">
                            <p className="text-[10px] font-bold text-zinc-400">
                                General grade
                            </p>
                            <p className="text-2xl font-bold text-zinc-700">
                                {Math.round(
                                    (((evaluation.respectRating ?? 0) +
                                        (evaluation.efficiencyRating ?? 0) +
                                        (evaluation.commitmentRating ?? 0) +
                                        (evaluation.initiativeRating ?? 0) +
                                        (evaluation.leadershipRating ?? 0) +
                                        (evaluation.competencyRating ?? 0)) /
                                        6) *
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
    const {
        objectives,
        setSelectedObjectiveIndex,
        selectedObjectiveIndex,
        selectedEvaluationStep,
    } = useObjectivesDataStore();
    const count =
        selectedEvaluationStep == 2
            ? objectives?.filter((obj) => obj.selfEvaluationStatus == "draft")
                  .length
            : objectives?.filter((obj) => obj.evaluationStatus == "draft")
                  .length;
    const title =
        selectedEvaluationStep == 2 ? "Self-Evaluation" : "Evaluation";

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
                {objectives
                    ?.filter((obj) => obj.status == "ok")
                    .map((objective, index) => {
                        const status =
                            selectedEvaluationStep == 2
                                ? objective?.selfEvaluationStatus
                                : objective?.evaluationStatus;
                        return (
                            <>
                                <button
                                    key={index}
                                    onClick={() =>
                                        setSelectedObjectiveIndex(index)
                                    }
                                    className={cn(
                                        "flex w-fullrelative items-between justify-start border-t border-b-zinc-100 border-t-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50",
                                        {
                                            "bg-zinc-50 border-l-4 border-l-green-300":
                                                selectedObjectiveIndex ===
                                                index,
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
                                                Submitted
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
                                    {objective.grade &&
                                        selectedEvaluationStep == 3 && (
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
        </div>
    );
}

export default EvaluationSidebar;
