"use client";
import {
    selectActiveObjective,
    selectActiveStep,
    useObjectivesDataStore,
} from "@/app/objectives/[userId]/_store/useStore";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { TextareaHTMLAttributes, useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { toast, useToast } from "../../../components/ui/use-toast";
import { useQueryState } from "nuqs";
import { cn } from "@/util/utils";

export function NewObjective({
    employee,
    objectives,
    className,
}: {
    employee: Employee;
    objectives: Partial<Objective>[];
    className?: string;
}) {
    const { user } = useAuth();
    const data = useObjectivesDataStore();
    const selectedObjective = useObjectivesDataStore(selectActiveObjective);
    const activeStep = useObjectivesDataStore(selectActiveStep);
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useQueryState<number>("step", {
        defaultValue: 0,
        parse: (value) => parseInt(value),
    });
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
    const { toast } = useToast();

    const isEditable =
        !selectedObjective ||
        (selectedObjective.status == "ok" && !isEditing) ||
        selectedObjective.status == "cancelled" ||
        selectedObjective.grade != null ||
        user?.employeeId !== employee.employeeId;

    const [year, setYear] = useQueryState<string>("year", {
        defaultValue: new Date().getFullYear().toString(),
        parse: (value) => value,
    });

    function renderStatusBadge() {
        if (selectedObjective?.status == "draft") {
            return (
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[10px] font-semibold text-zinc-700">
                    Draft
                    <Icon
                        icon="octicon:issue-draft-16"
                        className="ml-1"
                        fontSize={10}
                    />
                </div>
            );
        } else if (selectedObjective?.status == "sent") {
            return (
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[10px] font-semibold text-blue-500">
                    Submitted
                    <Icon icon="mdi:check-all" className="ml-1" fontSize={10} />
                </div>
            );
        } else if (selectedObjective?.status == "invalid") {
            return (
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-orange-100 p-1 px-2 text-[10px] font-semibold text-orange-500">
                    Rejected
                    <Icon icon="mdi:alert" className="ml-1" fontSize={10} />
                </div>
            );
        } else if (selectedObjective?.status == "ok") {
            return (
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[10px] font-semibold text-green-500">
                    Approved
                    <Icon icon="mdi:check-all" className="ml-1" fontSize={10} />
                </div>
            );
        } else if (selectedObjective?.status == "cancelled") {
            return (
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-100 p-1 px-2 text-[10px] font-semibold text-zinc-500">
                    Cancelled
                    <Icon icon="charm:cross" className="ml-1" fontSize={10} />
                </div>
            );
        }
    }

    async function deleteObjective(index: number) {
        if (selectedObjective?.status == "ok") {
            axios
                .delete(
                    process.env.NEXT_PUBLIC_API_URL +
                        "/api/objectives/" +
                        selectedObjective?.objectiveId
                )
                .then((response) => {
                    if (response.status == 201) {
                        data.fetchObjectives(
                            employee.employeeId.toString(),
                            year
                        );
                        toast({
                            description: "Successfully updated objectives",
                        });
                        ``;
                    }
                })
                .catch((err) => {
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    });
                    console.log(err);
                })
                .finally(() => {});
        } else if (selectedObjective?.objectiveId) {
            axios
                .delete(
                    process.env.NEXT_PUBLIC_API_URL +
                        "/api/objectives/" +
                        selectedObjective?.objectiveId
                )
                .then((response) => {
                    const arr = [...objectives];
                    data.setObjectivesLocal(
                        arr.filter((obj, idx) => index !== idx)
                    );
                    toast({
                        description: "Successfully deleted objective",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    });
                })
                .finally(() => {});
        } else {
            const arr = [...objectives];
            data.setObjectivesLocal(arr.filter((obj, idx) => index !== idx));
        }
    }

    async function reviewObjective(objective: Partial<Objective>) {
        axios
            .put(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/objectives/" +
                    objective.objectiveId +
                    (objective.status == "ok" ? "/update" : ""),
                {
                    objective,
                }
            )
            .then((response) => {
                if (response.status == 201) {
                    data.fetchObjectives(
                        employee.employeeId.toString(),
                        year ?? new Date().getFullYear().toString()
                    );
                    toast({
                        description: "Successfully updated objectives",
                    });
                    ``;
                }
            })
            .catch((err) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
                console.log(err);
            });
    }

    async function updateObjective(objective: Partial<Objective>) {
        axios
            .put(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/objectives/" +
                    objective.objectiveId,
                {
                    objective,
                }
            )
            .then((response) => {
                if (response.status == 201) {
                    data.fetchObjectives(employee.employeeId.toString(), year);
                    toast({
                        description: "Successfully updated objectives",
                    });
                    ``;
                }
            })
            .catch((err) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
                console.log(err);
            });
    }

    useEffect(() => {
        setIsCancelModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsEditing(false);
        setIsUpdateModalOpen(false);
    }, [selectedObjective]);

    if (!selectedObjective) return null;
    return (
        <div
            className={cn(
                "relative flex flex-1 flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm",
                className
            )}
        >
            {selectedObjective && (
                <>
                    <p className="absolute bottom-4 left-4 font-mono text-[6px] text-muted-foreground opacity-75">
                        OBJECTIVE-ID: {selectedObjective.objectiveId}
                    </p>
                    {/* Objective Header */}
                    <div className="flex w-full items-center justify-between">
                        {renderStatusBadge()}
                        {user?.employeeId == employee.employeeId && (
                            <>
                                {selectedObjective.status !== "ok" &&
                                    selectedObjective.status !==
                                        "cancelled" && (
                                        <>
                                            <div
                                                className={
                                                    "flex items-center justify-center gap-2"
                                                }
                                            >
                                                <Button
                                                    disabled={
                                                        JSON.stringify(
                                                            data.objectives
                                                        ) ==
                                                            JSON.stringify(
                                                                data.objectivesLocal
                                                            ) ||
                                                        !selectedObjective.title
                                                    }
                                                    onClick={() => {
                                                        updateObjective(
                                                            selectedObjective
                                                        );
                                                    }}
                                                    variant="primary"
                                                >
                                                    Save changes
                                                    <Icon
                                                        icon="ic:baseline-save-alt"
                                                        className="ml-1"
                                                        fontSize={14}
                                                    />
                                                </Button>
                                                <Button
                                                    disabled={objectives.some(
                                                        (obj) => obj.grade
                                                    )}
                                                    onClick={() => {
                                                        setIsDeleteModalOpen(
                                                            true
                                                        );
                                                    }}
                                                    variant="alertOutline"
                                                >
                                                    Delete objective
                                                    <Icon
                                                        icon="gridicons:trash"
                                                        className="ml-1"
                                                        fontSize={14}
                                                    />
                                                </Button>
                                                <Modal
                                                    show={isDeleteModalOpen}
                                                    onClose={() =>
                                                        setIsDeleteModalOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <div className="flex w-[500px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
                                                        <div className="flex w-full flex-col items-start justify-between">
                                                            <p className="text-xl font-bold text-zinc-700">
                                                                Delete this
                                                                objective ?
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                This action
                                                                cannot be
                                                                undone.
                                                            </p>
                                                            <div className="mt-4 flex w-full items-center justify-end gap-2">
                                                                <Button
                                                                    onClick={() => {
                                                                        setIsDeleteModalOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                    variant="outline"
                                                                >
                                                                    Cancel
                                                                    <Icon
                                                                        icon="charm:cross"
                                                                        className="ml-1"
                                                                        fontSize={
                                                                            14
                                                                        }
                                                                    />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        deleteObjective(
                                                                            data.selectedObjectiveIndex
                                                                        );
                                                                        setIsDeleteModalOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                    variant="alert"
                                                                >
                                                                    Confirm
                                                                    <Icon
                                                                        icon="gridicons:trash"
                                                                        className="ml-1"
                                                                        fontSize={
                                                                            14
                                                                        }
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Modal>
                                            </div>
                                        </>
                                    )}
                            </>
                        )}
                        {user?.employeeId == employee.supervisorId && (
                            <>
                                {selectedObjective.status == "ok" &&
                                    step == 2 && (
                                        <>
                                            <div
                                                className={
                                                    "flex items-center justify-center gap-2"
                                                }
                                            >
                                                <Button
                                                    disabled={objectives.some(
                                                        (obj) => obj.grade
                                                    )}
                                                    onClick={() => {
                                                        setIsCancelModalOpen(
                                                            true
                                                        );
                                                    }}
                                                    variant="alert"
                                                >
                                                    Cancel objective
                                                    <Icon
                                                        icon="charm:cross"
                                                        className="ml-1"
                                                        fontSize={14}
                                                    />
                                                </Button>

                                                <Modal
                                                    show={isCancelModalOpen}
                                                    onClose={() =>
                                                        setIsCancelModalOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <div className="flex w-[500px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
                                                        <div className="flex w-full flex-col items-start justify-between">
                                                            <p className="text-xl font-bold text-zinc-700">
                                                                Cancel this
                                                                objective ?
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                This action
                                                                cannot be
                                                                undone.
                                                            </p>
                                                            <div className="mt-4 flex w-full items-center justify-end gap-2">
                                                                <Button
                                                                    onClick={() => {
                                                                        setIsCancelModalOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                    variant="outline"
                                                                >
                                                                    Cancel
                                                                    <Icon
                                                                        icon="charm:cross"
                                                                        className="ml-1"
                                                                        fontSize={
                                                                            14
                                                                        }
                                                                    />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        deleteObjective(
                                                                            data.selectedObjectiveIndex
                                                                        );
                                                                        setIsDeleteModalOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                    variant="alert"
                                                                >
                                                                    Confirm
                                                                    <Icon
                                                                        icon="gridicons:trash"
                                                                        className="ml-1"
                                                                        fontSize={
                                                                            14
                                                                        }
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Modal>
                                            </div>
                                        </>
                                    )}
                                {selectedObjective.status !== "draft" &&
                                    selectedObjective.status !== "ok" &&
                                    (step == 1 || step == 0) && (
                                        <>
                                            <div
                                                className={
                                                    "flex items-center justify-center gap-2"
                                                }
                                            >
                                                <Button
                                                    onClick={() => {
                                                        const obj = {
                                                            ...selectedObjective,
                                                        };
                                                        obj.status = "ok";
                                                        updateObjective(obj);
                                                    }}
                                                    variant="primary"
                                                >
                                                    Approve
                                                    <Icon
                                                        icon="mdi:check-all"
                                                        className="ml-1"
                                                        fontSize={14}
                                                    />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        const obj = {
                                                            ...selectedObjective,
                                                        };
                                                        obj.status = "invalid";
                                                        updateObjective(obj);
                                                    }}
                                                    disabled={
                                                        selectedObjective.status ==
                                                        "invalid"
                                                    }
                                                    variant="alertOutline"
                                                >
                                                    Reject
                                                    <Icon
                                                        icon="mdi:alert"
                                                        className="ml-1"
                                                        fontSize={14}
                                                    />
                                                </Button>
                                            </div>
                                        </>
                                    )}
                            </>
                        )}
                    </div>
                    {/* Objective Form */}
                    <div className="mt-2 h-full w-full">
                        <p className="text-2xl font-bold text-zinc-700">
                            {selectedObjective.title
                                ? selectedObjective.title
                                : "Untitled"}
                        </p>
                        <form className="mt-2 grid w-full grid-cols-2 gap-4 border-b border-dashed border-b-zinc-200 pb-4 pt-2">
                            <div className="mt-1 flex flex-col gap-2">
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-700">
                                        TITLE OF THE OBJECTIVE
                                    </label>
                                    <input
                                        autoCorrect="off"
                                        spellCheck="false"
                                        maxLength={50}
                                        disabled={isEditable}
                                        type="text"
                                        required
                                        value={selectedObjective.title ?? ""}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].title = e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Enter the objective title"
                                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-700">
                                        DEADLINE OF THE OBJECTIVE
                                    </label>
                                    <input
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={isEditable}
                                        type="date"
                                        // 0101
                                        min={`${year}-01-01`}
                                        max={`${year}-12-31`}
                                        value={selectedObjective.deadline ?? ""}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].deadline = e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Pick the deadline for your objective"
                                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold placeholder-zinc-500 outline-none transition-all hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-700">
                                        OBJECTIVE KPI (KEY PERFORMANCE
                                        INDICATORS)
                                    </label>
                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={isEditable}
                                        value={selectedObjective.kpi ?? ""}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].kpi = e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Enter the objective's key performance indicators (KPI)"
                                        className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-1 flex flex-col gap-2">
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-700">
                                        OBJECTIVE DESCRIPTION / MAIN ACTIVITY
                                    </label>
                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={isEditable}
                                        value={
                                            selectedObjective.description ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].description = e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Enter the description of the objective"
                                        className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-700">
                                        OBJECTIVE SUCCESS CONDITIONS
                                    </label>
                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={isEditable}
                                        value={
                                            selectedObjective.successConditions ??
                                            ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].successConditions =
                                                e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Enter the objective’s success conditions"
                                        className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {selectedObjective.status == "ok" &&
                        step == 3 &&
                        user?.employeeId == employee.employeeId && (
                            <>
                                <div
                                    className={
                                        "flex flex-col items-end justify-center absolute bottom-2 right-2 gap-2"
                                    }
                                >
                                    <Button
                                        disabled={
                                            JSON.stringify(data.objectives) ==
                                                JSON.stringify(
                                                    data.objectivesLocal
                                                ) ||
                                            !selectedObjective.selfComment ||
                                            selectedObjective.selfEvaluationStatus ==
                                                "sent"
                                        }
                                        onClick={() => {
                                            const obj = {
                                                ...selectedObjective,
                                            };
                                            updateObjective(obj);
                                        }}
                                        variant="outline"
                                    >
                                        Save changes
                                        <Icon
                                            icon="ic:baseline-save-alt"
                                            className="ml-1"
                                            fontSize={14}
                                        />
                                    </Button>
                                </div>
                            </>
                        )}

                    {/* Staff self-evaluation */}
                    {user &&
                        step == 2 &&
                        objectives.every((obj) => obj.status == "ok") && (
                            <MidtermReview
                                employee={employee}
                                user={user}
                                step={step}
                            />
                        )}

                    {selectedObjective.status == "ok" &&
                        step == 4 &&
                        user?.employeeId == employee.supervisorId && (
                            <>
                                <div
                                    className={
                                        "flex flex-col items-end justify-center absolute bottom-2 right-2 gap-2"
                                    }
                                >
                                    <Button
                                        disabled={
                                            JSON.stringify(data.objectives) ==
                                                JSON.stringify(
                                                    data.objectivesLocal
                                                ) ||
                                            (!selectedObjective.grade &&
                                                !selectedObjective.comment) ||
                                            selectedObjective.evaluationStatus ==
                                                "sent"
                                        }
                                        onClick={() => {
                                            const obj = {
                                                ...selectedObjective,
                                            };
                                            updateObjective(obj);
                                        }}
                                        variant="outline"
                                    >
                                        Save changes
                                        <Icon
                                            icon="ic:baseline-save-alt"
                                            className="ml-1"
                                            fontSize={14}
                                        />
                                    </Button>
                                    <Button
                                        disabled={
                                            !selectedObjective.comment ||
                                            !selectedObjective.grade ||
                                            selectedObjective.evaluationStatus ==
                                                "sent"
                                        }
                                        onClick={() => {
                                            const obj = {
                                                ...selectedObjective,
                                            };
                                            obj.evaluationStatus = "sent";
                                            updateObjective(obj);
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
                                </div>
                            </>
                        )}

                    {/* Staff self-evaluation */}
                    {(user?.employeeId == employee.employeeId ||
                        selectedObjective.selfEvaluationStatus == "sent") &&
                        step == 3 &&
                        objectives.every((obj) => obj.status == "ok") && (
                            <div className="mt-4 flex w-full items-start justify-between">
                                {/* Status badge */}
                                <div className="flex flex-col items-start justify-start gap-1">
                                    {selectedObjective.selfEvaluationStatus !==
                                        "sent" && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[10px] font-semibold text-zinc-700">
                                            Unsubmitted
                                            <Icon
                                                icon="octicon:issue-draft-16"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    {selectedObjective.selfEvaluationStatus ==
                                        "sent" && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[10px] font-semibold text-blue-500">
                                            Submitted
                                            <Icon
                                                icon="mdi:check-all"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    <p className="mb-2 text-2xl font-bold text-zinc-700">
                                        Objective self-evaluation
                                    </p>
                                    <div className="flex w-[350px] flex-col items-start justify-start gap-1">
                                        <label className="text-[10px] font-medium text-zinc-700">
                                            OBJECTIVE REVIEW
                                        </label>
                                        <textarea
                                            autoCorrect="off"
                                            spellCheck="false"
                                            disabled={
                                                user?.employeeId !=
                                                    employee.employeeId ||
                                                selectedObjective.selfEvaluationStatus ==
                                                    "sent"
                                            }
                                            value={
                                                selectedObjective?.selfComment ??
                                                ""
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>
                                            ) => {
                                                if (data.objectivesLocal) {
                                                    const arr = [
                                                        ...data.objectivesLocal,
                                                    ];
                                                    arr[
                                                        data.selectedObjectiveIndex
                                                    ].selfComment =
                                                        e.target.value;
                                                    data.setObjectivesLocal(
                                                        arr
                                                    );
                                                }
                                            }}
                                            placeholder={`Write your self-evaluation for this objective`}
                                            className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-start text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* Staff evaluation */}
                    {(user?.employeeId == employee.supervisorId ||
                        selectedObjective.evaluationStatus == "sent") &&
                        step == 4 &&
                        selectedObjective.status == "ok" && (
                            <div className="mt-4 flex w-full items-start justify-between">
                                <div className="flex flex-col items-start justify-start gap-1">
                                    {selectedObjective.evaluationStatus !==
                                        "sent" && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[10px] font-semibold text-zinc-700">
                                            Unsubmitted
                                            <Icon
                                                icon="octicon:issue-draft-16"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    {selectedObjective.evaluationStatus ==
                                        "sent" && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[10px] font-semibold text-blue-500">
                                            Submitted
                                            <Icon
                                                icon="mdi:check-all"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    <p className="mb-2 text-2xl font-bold text-zinc-700">
                                        Supervisor evaluation
                                    </p>
                                    <div className="flex w-[350px] flex-col items-start justify-start gap-2">
                                        <div className="flex w-full items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                disabled={
                                                    user?.employeeId !=
                                                        employee.supervisorId ||
                                                    selectedObjective.evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    if (data.objectivesLocal) {
                                                        const arr = [
                                                            ...data.objectivesLocal,
                                                        ];
                                                        arr[
                                                            data.selectedObjectiveIndex
                                                        ].grade = 1;
                                                        data.setObjectivesLocal(
                                                            arr
                                                        );
                                                    }
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        selectedObjective?.grade ==
                                                        1
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
                                                    user?.employeeId !=
                                                        employee.supervisorId ||
                                                    selectedObjective.evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    if (data.objectivesLocal) {
                                                        const arr = [
                                                            ...data.objectivesLocal,
                                                        ];
                                                        arr[
                                                            data.selectedObjectiveIndex
                                                        ].grade = 2;
                                                        data.setObjectivesLocal(
                                                            arr
                                                        );
                                                    }
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        selectedObjective?.grade ==
                                                        2
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
                                                    user?.employeeId !=
                                                        employee.supervisorId ||
                                                    selectedObjective.evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    if (data.objectivesLocal) {
                                                        const arr = [
                                                            ...data.objectivesLocal,
                                                        ];
                                                        arr[
                                                            data.selectedObjectiveIndex
                                                        ].grade = 3;
                                                        data.setObjectivesLocal(
                                                            arr
                                                        );
                                                    }
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        selectedObjective?.grade ==
                                                        3
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
                                                    user?.employeeId !=
                                                        employee.supervisorId ||
                                                    selectedObjective.evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    if (data.objectivesLocal) {
                                                        const arr = [
                                                            ...data.objectivesLocal,
                                                        ];
                                                        arr[
                                                            data.selectedObjectiveIndex
                                                        ].grade = 4;
                                                        data.setObjectivesLocal(
                                                            arr
                                                        );
                                                    }
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        selectedObjective?.grade ==
                                                        4
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
                                                    user?.employeeId !=
                                                        employee.supervisorId ||
                                                    selectedObjective.evaluationStatus ==
                                                        "sent"
                                                }
                                                onClick={() => {
                                                    if (data.objectivesLocal) {
                                                        const arr = [
                                                            ...data.objectivesLocal,
                                                        ];
                                                        arr[
                                                            data.selectedObjectiveIndex
                                                        ].grade = 5;
                                                        data.setObjectivesLocal(
                                                            arr
                                                        );
                                                    }
                                                }}
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        selectedObjective?.grade ==
                                                        5
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-transparent border-green-300"
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
                                                user?.employeeId !=
                                                    employee.supervisorId ||
                                                selectedObjective.evaluationStatus ==
                                                    "sent"
                                            }
                                            value={
                                                selectedObjective?.comment ?? ""
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>
                                            ) => {
                                                if (data.objectivesLocal) {
                                                    const arr = [
                                                        ...data.objectivesLocal,
                                                    ];
                                                    arr[
                                                        data.selectedObjectiveIndex
                                                    ].comment =
                                                        e.currentTarget.value;
                                                    data.setObjectivesLocal(
                                                        arr
                                                    );
                                                }
                                            }}
                                            placeholder={`Write your evaluation for this objective`}
                                            className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-start text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                </>
            )}
        </div>
    );
}

function MidtermReview({
    user,
    employee,
    step,
}: {
    user: Employee;
    employee: Employee;
    step: number;
}) {
    const data = useObjectivesDataStore();
    const selectedObjective = data.objectivesLocal[data.selectedObjectiveIndex];
    const cachedObjective = data.objectives
        ? data.objectives[data.selectedObjectiveIndex]
        : null;

    async function saveReviews() {
        try {
            axios
                .post<Partial<Objective>[]>(
                    process.env.NEXT_PUBLIC_API_URL + "/api/objectives/bulk",
                    {
                        objectives: data.objectivesLocal,
                    }
                )
                .then((response) => {
                    if (response.status == 201) {
                        toast({
                            description: "Succesfully saved reviews.",
                        });
                        axios
                            .get(
                                process.env.NEXT_PUBLIC_API_URL +
                                    "/api/employees/" +
                                    employee.employeeId +
                                    "/objectives/"
                            )
                            .then((response) =>
                                data.setObjectives(response.data)
                            );
                    }
                })
                .catch((err) => {
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description:
                            "There was a problem with creating an objective.",
                    });
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="relative mt-4 flex w-full items-start justify-between gap-4">
            {selectedObjective.status == "ok" &&
                step == 2 &&
                cachedObjective && (
                    <>
                        {/* Status badge */}
                        <div className="flex flex-1 flex-col items-start justify-start gap-1">
                            {selectedObjective.selfReviewStatus == "draft" && (
                                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[10px] font-semibold text-zinc-700">
                                    Unreviewed
                                    <Icon
                                        icon="octicon:issue-draft-16"
                                        className="ml-1"
                                        fontSize={10}
                                    />
                                </div>
                            )}
                            {cachedObjective.selfReviewStatus == "sent" && (
                                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[10px] font-semibold text-blue-500">
                                    Reviewed
                                    <Icon
                                        icon="mdi:check-all"
                                        className="ml-1"
                                        fontSize={10}
                                    />
                                </div>
                            )}
                            <p className="mb-2 text-2xl font-bold text-zinc-700">
                                {employee.firstName.split(" ")[0]}&apos;s Review
                            </p>
                            <div className="flex w-full flex-col items-start justify-start gap-1">
                                <label className="text-[10px] font-medium text-zinc-700">
                                    Objective Review
                                </label>
                                <textarea
                                    autoCorrect="off"
                                    spellCheck="false"
                                    disabled={
                                        user?.employeeId !=
                                            employee.employeeId ||
                                        selectedObjective.selfReviewStatus ==
                                            "sent"
                                    }
                                    value={
                                        selectedObjective.midtermSelfComment ??
                                        ""
                                    }
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>
                                    ) => {
                                        if (data.objectivesLocal) {
                                            const arr = [
                                                ...data.objectivesLocal,
                                            ];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].midtermSelfComment =
                                                e.currentTarget.value;
                                            data.setObjectivesLocal(arr);
                                        }
                                    }}
                                    placeholder={`Write about your progress on this objective`}
                                    className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-start text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                />
                            </div>
                            {user?.employeeId == employee.employeeId && (
                                <div
                                    className={
                                        "flex items-center justify-center gap-2 mt-1"
                                    }
                                >
                                    <Button
                                        disabled={
                                            selectedObjective.selfReviewStatus ==
                                                "sent" ||
                                            JSON.stringify(data.objectives) ==
                                                JSON.stringify(
                                                    data.objectivesLocal
                                                )
                                        }
                                        onClick={() => {
                                            saveReviews();
                                        }}
                                        variant="outline"
                                    >
                                        Save for later
                                        <Icon
                                            icon="ic:baseline-save-alt"
                                            className="ml-1"
                                            fontSize={14}
                                        />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-1 flex-col items-start justify-start gap-1">
                            {selectedObjective.reviewStatus == "draft" && (
                                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[10px] font-semibold text-zinc-700">
                                    Unreviewed
                                    <Icon
                                        icon="octicon:issue-draft-16"
                                        className="ml-1"
                                        fontSize={10}
                                    />
                                </div>
                            )}
                            {selectedObjective.reviewStatus !== "draft" && (
                                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[10px] font-semibold text-blue-500">
                                    Reviewed
                                    <Icon
                                        icon="mdi:check-all"
                                        className="ml-1"
                                        fontSize={10}
                                    />
                                </div>
                            )}
                            <p className="mb-2 text-2xl font-bold text-zinc-700">
                                Supervisor Review
                            </p>
                            <div className="flex w-full flex-col items-start justify-start gap-1">
                                <label className="text-[10px] font-medium text-zinc-700">
                                    Supervisor Review
                                </label>
                                <textarea
                                    autoCorrect="off"
                                    spellCheck="false"
                                    disabled={
                                        user?.employeeId !=
                                            employee.supervisorId ||
                                        selectedObjective.reviewStatus == "sent"
                                    }
                                    value={
                                        selectedObjective.midtermComment ?? ""
                                    }
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>
                                    ) => {
                                        if (data.objectivesLocal) {
                                            const arr = [
                                                ...data.objectivesLocal,
                                            ];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].midtermComment =
                                                e.currentTarget.value;
                                            data.setObjectivesLocal(arr);
                                        }
                                    }}
                                    placeholder={`Write about this staff's progress on this objective`}
                                    className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-start text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                />
                            </div>
                            {user?.employeeId == employee.supervisorId && (
                                <div
                                    className={
                                        "flex items-center justify-center gap-2 mt-1"
                                    }
                                >
                                    <Button
                                        disabled={
                                            !selectedObjective.midtermComment ||
                                            JSON.stringify(data.objectives) ==
                                                JSON.stringify(
                                                    data.objectivesLocal
                                                ) ||
                                            selectedObjective.reviewStatus ==
                                                "sent"
                                        }
                                        onClick={() => {
                                            saveReviews();
                                        }}
                                        variant="outline"
                                    >
                                        Save for later
                                        <Icon
                                            icon="ic:baseline-save-alt"
                                            className="ml-1"
                                            fontSize={14}
                                        />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
        </div>
    );
}
