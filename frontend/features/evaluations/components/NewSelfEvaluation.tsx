"use client";
import {
    selectActiveObjective,
    useObjectivesDataStore,
} from "@/app/objectives/[userId]/_store/useStore";
import Button from "@/components/ui/Button";
import { getCurrentMySQLDate } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SetStateAction, useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Chip from "../../../components/ui/Chip";
import { MAX_INPUT_LENGTH, MIN_INPUT_LENGTH } from "@/config";

export function NewSelfEvaluation({
    user,
    onSubmit,
    employee,
}: {
    user: Employee;
    employee: Employee;
    onSubmit: (evaluation: Partial<Evaluation>) => any;
}) {
    const data = useObjectivesDataStore();
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

    const metrics: {
        name:
        | "selfEfficiency"
        | "selfCompetency"
        | "selfCommitment"
        | "selfInitiative"
        | "selfRespect"
        | "selfLeadership"
        | "selfOverall";
        rating:
        | "selfEfficiencyRating"
        | "selfCompetencyRating"
        | "selfCommitmentRating"
        | "selfInitiativeRating"
        | "selfRespectRating"
        | "selfLeadershipRating"
        | "selfOverallRating";
        label: string;
    }[] = [
            {
                name: "selfEfficiency",
                rating: "selfEfficiencyRating",
                label: "EFFICIENCY / EFFICACITE",
            },
            {
                name: "selfCompetency",
                rating: "selfCompetencyRating",
                label: "TECHNICAL COMPETENCY / COMPETENCES TECHNIQUES",
            },
            {
                name: "selfCommitment",
                rating: "selfCommitmentRating",
                label: "COMMITMENT / ENGAGEMENT",
            },
            {
                name: "selfOverall",
                rating: "selfOverallRating",
                label: "OVERALL COMMENT / COMMENTAIRE GENERAL"
            },
            {
                name: "selfInitiative",
                rating: "selfInitiativeRating",
                label: "TAKING INITITATIVE / PRISE D’INITIATIVE",
            },
            {
                name: "selfRespect",
                rating: "selfRespectRating",
                label: "FOLLOWING INSTRUCTIONS / RESPECT DES PROCEDURES",
            },
            {
                name: "selfLeadership",
                rating: "selfLeadershipRating",
                label: "LEADERSHIP",
            },
        ];

    return (
        <div className="relative flex h-full w-full flex-col items-start justify-start ">
            {data.evaluationLocal &&
                ((user.employeeId == employee.supervisorId &&
                    data.evaluationLocal.selfEvaluationStatus == "sent") ||
                    user.employeeId == employee.employeeId) ? (
                <>
                    <div className="flex w-full items-center justify-between">
                        {data.evaluationLocal.selfEvaluationStatus ==
                            "draft" && (
                                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                    Draft
                                    <Icon
                                        icon="octicon:issue-draft-16"
                                        className="ml-1"
                                        fontSize={10}
                                    />
                                </div>
                            )}
                        {data.evaluationLocal.selfEvaluationStatus ==
                            "sent" && (
                                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-500">
                                    Submitted
                                    <Icon
                                        icon="mdi:check-all"
                                        className="ml-1"
                                        fontSize={10}
                                    />
                                </div>
                            )}
                    </div>
                    <div className="mt-2 h-full w-full">
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-zinc-700">
                                {employee.firstName.split(" ")[0]}&apos;s
                                competency self-evaluation
                            </p>
                            <div className="">
                                <Chip variant="background">
                                    <Icon
                                        icon="mdi:alert"
                                        className="mr-1"
                                        fontSize={14}
                                    />
                                    You must fill required all fields before
                                    submission.
                                </Chip>
                            </div>
                        </div>
                        <form className="mt-4 grid w-full grid-cols-2 gap-4 pt-2">
                            <div className="flex flex-col gap-3">
                                {metrics.slice(0, 4).map((metric) => (
                                    <div
                                        key={metric.name}
                                        className="flex flex-col justify-start gap-1"
                                    >
                                        <label className="text-[10px] font-medium text-zinc-700">
                                            {metric.label}{" "}
                                            {metric.label !== "LEADERSHIP" && (
                                                // @ts-ignore
                                                data.evaluationLocal[metric.name] && data.evaluationLocal[metric.name].length < 200 ? <span className="text-red-700 text-[10px]">
                                                    {/* @ts-ignore */}
                                                    {MIN_INPUT_LENGTH - data.evaluationLocal[metric.name].length} characters left
                                                </span> : <span className="text-red-700 text-[10px]">
                                                    required*
                                                </span>
                                            )}
                                        </label>

                                        <textarea
                                            autoCorrect="off"
                                            minLength={MIN_INPUT_LENGTH}
                                            maxLength={MAX_INPUT_LENGTH}
                                            spellCheck="false"
                                            disabled={
                                                user.employeeId !==
                                                data.evaluationLocal
                                                    .employeeId ||
                                                data.evaluationLocal
                                                    .selfEvaluationStatus ==
                                                "sent"
                                            }
                                            value={
                                                data.evaluationLocal[
                                                metric.name
                                                ] ?? ""
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>
                                            ) => {
                                                const obj = {
                                                    ...data.evaluationLocal,
                                                };
                                                obj[metric.name] =
                                                    e.target.value;
                                                data.setEvaluationLocal(obj);
                                            }}
                                            placeholder={`Write your ${metric.name
                                                .split("self")[1]
                                                .toLowerCase()} review`}
                                            className="h-[90px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3">
                                {metrics.slice(4, 7).map((metric) => (
                                    <div
                                        key={metric.name}
                                        className="flex flex-col justify-start gap-1"
                                    >
                                        <label className="text-[10px] font-medium text-zinc-700">
                                            {metric.label}{" "}
                                            {metric.label !== "LEADERSHIP" && (
                                                // @ts-ignore
                                                data.evaluationLocal[metric.name] && data.evaluationLocal[metric.name].length < 200 ? <span className="text-red-700 text-[10px]">
                                                    {/* @ts-ignore */}
                                                    {MIN_INPUT_LENGTH - data.evaluationLocal[metric.name].length} characters left
                                                </span> : <span className="text-red-700 text-[10px]">
                                                    required*
                                                </span>
                                            )}
                                        </label>

                                        <textarea
                                            autoCorrect="off"
                                            minLength={MIN_INPUT_LENGTH}
                                            maxLength={MAX_INPUT_LENGTH}
                                            spellCheck="false"
                                            disabled={
                                                user.employeeId !==
                                                data.evaluationLocal
                                                    .employeeId ||
                                                data.evaluationLocal
                                                    .selfEvaluationStatus ==
                                                "sent"
                                            }
                                            value={
                                                data.evaluationLocal[
                                                metric.name
                                                ] ?? ""
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>
                                            ) => {
                                                const obj = {
                                                    ...data.evaluationLocal,
                                                };
                                                obj[metric.name] =
                                                    e.target.value;
                                                data.setEvaluationLocal(obj);
                                            }}
                                            placeholder={`Write your ${metric.name
                                                .split("self")[1]
                                                .toLowerCase()} review`}
                                            className="h-[90px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </form>

                        {user.employeeId == data.evaluationLocal.employeeId && (
                            <div className="absolute bottom-4 right-4 flex w-full items-center justify-end gap-2">
                                <Button
                                    disabled={
                                        JSON.stringify(data.evaluation) ===
                                        JSON.stringify(data.evaluationLocal)
                                    }
                                    onClick={() => {
                                        onSubmit(data.evaluationLocal);
                                    }}
                                    variant="outline"
                                >
                                    Save for later
                                    <Icon
                                        icon="material-symbols:download"
                                        className="ml-1"
                                        fontSize={14}
                                    />
                                </Button>
                                <Button
                                    disabled={
                                        data.evaluationLocal
                                            .selfEvaluationStatus == "sent" ||
                                        metrics.some(metric => {
                                            if (metric.name == "selfLeadership") {
                                                return false;
                                            }
                                            // @ts-ignore
                                            return !data.evaluationLocal[metric.name] || data.evaluationLocal[metric.name].length < MIN_INPUT_LENGTH;
                                        })
                                    }
                                    onClick={() => {
                                        setIsSubmitModalOpen(true);
                                    }}
                                    variant="primary"
                                >
                                    Submit self-evaluation
                                    <Icon
                                        icon="material-symbols:upload"
                                        className="ml-1"
                                        fontSize={14}
                                    />
                                </Button>
                                <Modal
                                    show={isSubmitModalOpen}
                                    onClose={() => setIsSubmitModalOpen(false)}
                                >
                                    <div className="flex w-[500px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
                                        <div className="flex w-full flex-col items-start justify-between">
                                            <p className="text-xl font-bold text-zinc-700">
                                                Submit self-evaluation ?
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                This action cannot be undone.
                                            </p>
                                            <div className="mt-4 flex w-full items-center justify-end gap-2">
                                                <Button
                                                    onClick={() => {
                                                        setIsSubmitModalOpen(
                                                            false
                                                        );
                                                    }}
                                                    variant="outline"
                                                >
                                                    Cancel
                                                    <Icon
                                                        icon="charm:cross"
                                                        className="ml-1"
                                                        fontSize={14}
                                                    />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        const arr = {
                                                            ...data.evaluationLocal,
                                                        };
                                                        arr.selfEvaluationStatus =
                                                            "sent";
                                                        onSubmit(arr);
                                                        setIsSubmitModalOpen(
                                                            false
                                                        );
                                                    }}
                                                    variant="primary"
                                                >
                                                    Confirm
                                                    <Icon
                                                        icon="ri:mail-send-fill"
                                                        className="ml-1"
                                                        fontSize={14}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        )}
                    </div>
                    <div className=""></div>
                </>
            ) : (
                <>
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-zinc-300">
                        <Icon icon="iconamoon:pen-fill" fontSize={48} />
                        <h1 className="text-2xl font-bold">
                            A self-evaluation has not been made yet.
                        </h1>
                    </div>
                </>
            )}
        </div>
    );
}
