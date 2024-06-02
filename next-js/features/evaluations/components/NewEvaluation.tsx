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
import { useGetSettings } from "@/features/settings/queries";
import { TextArea } from "@/components/ui/TextArea";

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
    const { data: settings } = useGetSettings();
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
    console.log("evaluationLocal", data.evaluationLocal);
    const metrics: {
        name:
        | "efficiency"
        | "competency"
        | "commitment"
        | "initiative"
        | "respect"
        | "leadership"
        | "overall"
        rating:
        | "efficiencyRating"
        | "competencyRating"
        | "commitmentRating"
        | "initiativeRating"
        | "respectRating"
        | "leadershipRating"
        | "overallRating"
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
            {
                name: "overall",
                rating: "overallRating",
                label: "OVERALL PERFORMANCE / PERFORMANCE GLOBALE",
            }
        ];

    if (!settings) return;
    return (
        <div className="relative flex flex-col items-start justify-start w-full h-full transition-all rounded-md">
            {data.evaluationLocal &&
                ((user.employeeId == data.evaluationLocal.employeeId &&
                    data.evaluationLocal.evaluationStatus == "sent") ||
                    user.employeeId == data.evaluationLocal.supervisorId) ? (
                <div className="w-full">
                    <div className="flex items-center justify-between w-full">
                        {data.evaluationLocal.evaluationStatus == "draft" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-medium text-zinc-600">
                                Draft
                                <Icon
                                    icon="octicon:issue-draft-16"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {data.evaluationLocal.evaluationStatus == "sent" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-medium text-blue-500">
                                Sent
                                <Icon
                                    icon="mdi:check-all"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                    </div>
                    <div className="w-full h-full mt-2">
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-zinc-600">
                                {employee.firstName.split(" ")[0]}&apos;s
                                competency evaluation
                            </p>
                            <div className="absolute flex flex-col items-end justify-center p-2 border rounded-md right-4 top-4 border-zinc-100 text-end">
                                <p className="text-[10px] font-bold text-zinc-400">
                                    Estimated competency grade
                                </p>
                                <p className="text-2xl font-bold text-zinc-600">
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
                                            (data.evaluationLocal
                                                .leadershipRating
                                                ? 6
                                                : 5)) *
                                        100
                                    ) / 100}
                                    <span className="text-xs font-bold text-zinc-400">
                                        /5
                                    </span>
                                </p>
                            </div>
                        </div>
                        <form className="flex w-full pt-2 pb-4 mt-4 ">
                            <div className="flex flex-col w-full gap-8">
                                {metrics.slice(0, 6).map((metric) => (
                                    <div
                                        key={metric.name}
                                        className="h-[120px] flex flex-col justify-start gap-1 w-full"
                                    >
                                        <label className="text-[10px] font-medium text-zinc-600">
                                            {metric.label}{" "}
                                            {metric.label !== "LEADERSHIP" && (
                                                // @ts-ignore
                                                data.evaluationLocal[metric.name] && data.evaluationLocal[metric.name].length < parseInt(settings.SETTING_MIN_CHAR) ? <span className="text-red-700 text-[10px]">
                                                    {/* @ts-ignore */}
                                                    {parseInt(settings.SETTING_MIN_CHAR) - data.evaluationLocal[metric.name].length} characters left
                                                </span> : <span className="text-red-700 text-[10px]">
                                                    required*
                                                </span>
                                            )}
                                        </label>
                                        <div className="flex items-center justify-center w-full gap-1">
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

                                                    obj[metric.rating] = obj[metric.rating] == 1 ? null : 1;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${data.evaluationLocal[
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
                                                    obj[metric.rating] = obj[metric.rating] == 2 ? null : 2;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${data.evaluationLocal[
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
                                                    obj[metric.rating] = obj[metric.rating] == 3 ? null : 3;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${data.evaluationLocal[
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
                                                    obj[metric.rating] = obj[metric.rating] == 4 ? null : 4;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${data.evaluationLocal[
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
                                                    obj[metric.rating] = obj[metric.rating] == 5 ? null : 5;
                                                    data.setEvaluationLocal(
                                                        obj
                                                    );
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${data.evaluationLocal[
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

                                        <TextArea
                                            autoCorrect="off"
                                            minLength={parseInt(settings.SETTING_MIN_CHAR)}
                                            maxLength={parseInt(settings.SETTING_MAX_CHAR)}
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
                                            className="h-[80px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </form>

                        <div className="w-full h-16 rounded-sm bg-zinc-100" />
                        <div className="flex items-start justify-between mt-4">
                            <p className="text-2xl font-bold text-zinc-600">
                                {employee.firstName.split(" ")[0]}&apos;s
                                <span className="text-brand"> overall evaluation</span>
                            </p>
                            <div className="flex flex-col items-end justify-center p-2 border rounded-md border-zinc-100 text-end">
                                <p className="text-[10px] font-bold text-zinc-400">
                                    Overall grade
                                </p>
                                <p className="text-2xl font-bold text-zinc-600">
                                    {Math.round(
                                        ((
                                            (data.evaluationLocal
                                                .overallRating ?? 0)) *
                                            100
                                        )) / 100}
                                    <span className="text-xs font-bold text-zinc-400">
                                        /5
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div
                            key={metrics[6].name}
                            className="h-[120px] mt-4 flex flex-col justify-start gap-1 w-full"
                        >
                            <label className="text-[10px] font-medium text-zinc-600">
                                {metrics[6].label}{" "}
                                {metrics[6].label !== "LEADERSHIP" && (
                                    // @ts-ignore
                                    data.evaluationLocal[metrics[6].name] && data.evaluationLocal[metrics[6].name].length < parseInt(settings.SETTING_MIN_CHAR) ? <span className="text-red-700 text-[10px]">
                                        {/* @ts-ignore */}
                                        {parseInt(settings.SETTING_MIN_CHAR) - data.evaluationLocal[metrics[6].name].length} characters left
                                    </span> : <span className="text-red-700 text-[10px]">
                                        required*
                                    </span>
                                )}
                            </label>
                            <div className="flex items-center justify-center w-full gap-1">
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
                                        obj[metrics[6].rating] = obj[metrics[6].rating] == 1 ? null : 1;
                                        data.setEvaluationLocal(
                                            obj
                                        );
                                    }}
                                    className={
                                        "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                        ` ${data.evaluationLocal[
                                            metrics[6].rating
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
                                        obj[metrics[6].rating] = obj[metrics[6].rating] == 2 ? null : 2;
                                        data.setEvaluationLocal(
                                            obj
                                        );
                                    }}
                                    className={
                                        "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                        ` ${data.evaluationLocal[
                                            metrics[6].rating
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
                                        obj[metrics[6].rating] = obj[metrics[6].rating] == 3 ? null : 3;
                                        data.setEvaluationLocal(
                                            obj
                                        );
                                    }}
                                    className={
                                        "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                        ` ${data.evaluationLocal[
                                            metrics[6].rating
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
                                        obj[metrics[6].rating] = obj[metrics[6].rating] == 4 ? null : 4;
                                        data.setEvaluationLocal(
                                            obj
                                        );
                                    }}
                                    className={
                                        "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                        ` ${data.evaluationLocal[
                                            metrics[6].rating
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
                                        obj[metrics[6].rating] = obj[metrics[6].rating] == 5 ? null : 5;
                                        data.setEvaluationLocal(
                                            obj
                                        );
                                    }}
                                    className={
                                        "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                        ` ${data.evaluationLocal[
                                            metrics[6].rating
                                        ] == 5
                                            ? "bg-green-400 text-green-50 border-transparent"
                                            : " text-green-500 bg-green-50 border-green-300"
                                        }`
                                    }
                                >
                                    5
                                </button>
                            </div>

                            <TextArea
                                autoCorrect="off"
                                minLength={parseInt(settings.SETTING_MIN_CHAR)}
                                maxLength={parseInt(settings.SETTING_MAX_CHAR)}
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
                                    metrics[6].name
                                    ] ?? ""
                                }
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                ) => {
                                    const obj = {
                                        ...data.evaluationLocal,
                                    };
                                    obj[metrics[6].name] =
                                        e.target.value;
                                    data.setEvaluationLocal(obj);
                                }}
                                placeholder={`Write your ${metrics[6].name} review`}
                                className="h-[80px]"
                            />
                        </div>
                        {user.employeeId ==
                            data.evaluationLocal.supervisorId && (
                                <div className="flex items-center justify-end w-full gap-2 mt-4">
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
                                            metrics.some(metric => {
                                                if (metric.name == "leadership") {
                                                    return false;
                                                }
                                                // @ts-ignore
                                                return !data.evaluationLocal[metric.rating] || !data.evaluationLocal[metric.name] || data.evaluationLocal[metric.name].length < settings.SETTING_MIN_CHAR;

                                            })

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
                                            <div className="flex flex-col items-start justify-between w-full">
                                                <p className="text-xl font-bold text-zinc-600">
                                                    Submit evaluation ?
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    This action cannot be undone.
                                                </p>
                                                <div className="flex items-center justify-end w-full gap-2 mt-4">
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
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-zinc-300">
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
