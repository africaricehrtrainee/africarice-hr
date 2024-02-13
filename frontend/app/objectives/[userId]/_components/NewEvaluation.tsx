"use client";
import {
    selectActiveObjective,
    useObjectivesDataStore,
} from "@/app/objectives/[userId]/_store/useStore";
import Button from "@/components/ui/Button";
import { getCurrentMySQLDate } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SetStateAction, useEffect, useState } from "react";
import Modal from "../../../../components/ui/Modal";
import Chip from "../../../../components/ui/Chip";

export function NewEvaluation({
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
    console.log("evaluationLocal", data.evaluationLocal);
    const metrics: {
        name:
            | "efficiency"
            | "competency"
            | "commitment"
            | "initiative"
            | "respect"
            | "leadership";
        rating:
            | "efficiencyRating"
            | "competencyRating"
            | "commitmentRating"
            | "initiativeRating"
            | "respectRating"
            | "leadershipRating";
        label: string;
    }[] = [
        {
            name: "efficiency",
            rating: "efficiencyRating",
            label: "EFFICIENCY / EFFICACITE",
        },
        {
            name: "competency",
            rating: "competencyRating",
            label: "TECHNICAL COMPETENCY / COMPETENCES TECHNIQUES",
        },
        {
            name: "commitment",
            rating: "commitmentRating",
            label: "COMMITMENT / ENGAGEMENT",
        },
        {
            name: "initiative",
            rating: "initiativeRating",
            label: "TAKING INITITATIVE / PRISE D’INITIATIVE",
        },
        {
            name: "respect",
            rating: "respectRating",
            label: "FOLLOWING INSTRUCTIONS / RESPECT DES PROCEDURES",
        },
        {
            name: "leadership",
            rating: "leadershipRating",
            label: "LEADERSHIP",
        },
    ];

    return (
        <div className="relative flex h-full w-full flex-col items-start justify-start rounded-md transition-all">
            {data.evaluationLocal &&
            ((user.employeeId == data.evaluationLocal.employeeId &&
                data.evaluationLocal.evaluationStatus == "sent") ||
                user.employeeId == data.evaluationLocal.supervisorId) ? (
                <>
                    <div className="flex w-full items-center justify-between">
                        {data.evaluationLocal.evaluationStatus == "draft" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                Draft
                                <Icon
                                    icon="octicon:issue-draft-16"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {data.evaluationLocal.evaluationStatus == "sent" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-500">
                                Sent
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
                                evaluation
                            </p>
                            <div className="absolute right-4 top-4 flex flex-col items-end justify-center rounded-md border border-zinc-100 p-2 text-end">
                                <p className="text-[10px] font-bold text-zinc-400">
                                    Estimated total grade
                                </p>
                                <p className="text-2xl font-bold text-zinc-700">
                                    {Math.round(
                                        (((data.evaluationLocal.respectRating ??
                                            0) +
                                            (data.evaluationLocal
                                                .efficiencyRating ?? 0) +
                                            (data.evaluationLocal
                                                .commitmentRating ?? 0) +
                                            (data.evaluationLocal
                                                .initiativeRating ?? 0) +
                                            (data.evaluationLocal
                                                .leadershipRating ?? 0) +
                                            (data.evaluationLocal
                                                .competencyRating ?? 0)) /
                                            6) *
                                            100
                                    ) / 100}
                                    <span className="text-xs font-bold text-zinc-400">
                                        /5
                                    </span>
                                </p>
                            </div>
                        </div>
                        <form className="mt-4 grid w-full grid-cols-2 gap-4 pt-2">
                            <div className="flex flex-col gap-3">
                                {metrics.slice(0, 3).map((metric) => (
                                    <div
                                        key={metric.name}
                                        className="flex flex-col justify-start gap-1"
                                    >
                                        <label className="text-[10px] font-medium text-zinc-300">
                                            {metric.label}{" "}
                                            <span className="text-[8px] text-brand">
                                                * (required)
                                            </span>
                                        </label>
                                        <div className="flex w-full items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 1;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 1
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                1
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 2;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 2
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                2
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 3;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 3
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                3
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 4;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 4
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                4
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 5;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 5
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                5
                                            </button>
                                        </div>

                                        <textarea
                                            autoCorrect="off"
                                            spellCheck="false"
                                            disabled={
                                                user.employeeId !==
                                                    data.evaluationLocal
                                                        .supervisorId ||
                                                data.evaluationLocal
                                                    .evaluationStatus == "sent"
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
                                            placeholder={`Write your ${metric.name} review`}
                                            className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3">
                                {metrics.slice(3, 6).map((metric) => (
                                    <div
                                        key={metric.name}
                                        className="flex flex-col justify-start gap-1"
                                    >
                                        <label className="text-[10px] font-medium text-zinc-300">
                                            {metric.label}{" "}
                                            <span className="text-[8px] text-brand">
                                                * (required)
                                            </span>
                                        </label>
                                        <div className="flex w-full items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 1;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 1
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                1
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 2;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 2
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                2
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 3;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 3
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                3
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 4;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 4
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                4
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        data.evaluationLocal
                                                            .supervisorId ||
                                                    data.evaluationLocal
                                                        .evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    const obj = {
                                                        ...data.evaluationLocal,
                                                    };
                                                    obj[metric.rating] = 5;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        data.evaluationLocal[
                                                            metric.rating
                                                        ] == 5
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-50 border-green-300"
                                                    }`
                                                }
                                            >
                                                5
                                            </button>
                                        </div>

                                        <textarea
                                            autoCorrect="off"
                                            spellCheck="false"
                                            disabled={
                                                user.employeeId !==
                                                    data.evaluationLocal
                                                        .supervisorId ||
                                                data.evaluationLocal
                                                    .evaluationStatus == "sent"
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
                                            placeholder={`Write your ${metric.name} review`}
                                            className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </form>
                        <div className="absolute bottom-4 left-4">
                            <Chip variant="background">
                                <Icon
                                    icon="mdi:alert"
                                    className="mr-1"
                                    fontSize={14}
                                />
                                You must fill all fields before submission.
                            </Chip>
                        </div>
                        {user.employeeId ==
                            data.evaluationLocal.supervisorId && (
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
                                        icon="iconamoon:pen-fill"
                                        className="ml-1"
                                        fontSize={14}
                                    />
                                </Button>
                                <Button
                                    disabled={
                                        data.evaluationLocal.evaluationStatus ==
                                            "sent" ||
                                        !data.evaluationLocal.efficiency ||
                                        !data.evaluationLocal
                                            .efficiencyRating ||
                                        !data.evaluationLocal.competency ||
                                        !data.evaluationLocal
                                            .competencyRating ||
                                        !data.evaluationLocal.commitment ||
                                        !data.evaluationLocal
                                            .commitmentRating ||
                                        !data.evaluationLocal.initiative ||
                                        !data.evaluationLocal
                                            .initiativeRating ||
                                        !data.evaluationLocal.respect ||
                                        !data.evaluationLocal.respectRating ||
                                        !data.evaluationLocal.leadership ||
                                        !data.evaluationLocal.leadershipRating
                                    }
                                    onClick={() => {
                                        setIsSubmitModalOpen(true);
                                    }}
                                    variant="primary"
                                >
                                    Submit evaluation
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
                                                Submit evaluation ?
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
                                                        arr.evaluationStatus =
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
                            An evaluation has not been submitted yet.
                        </h1>
                    </div>
                </>
            )}
        </div>
    );
}
