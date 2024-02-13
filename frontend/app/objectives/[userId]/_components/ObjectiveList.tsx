import { Key, useState } from "react";
import Chip from "@/components/ui/Chip";
import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "@/components/ui/Button";
import { cn } from "@/util/utils";
import { useAuth } from "@/hooks/useAuth";
import {
    selectActiveStep,
    useObjectivesDataStore,
} from "@/app/objectives/[userId]/_store/useStore";
import axios from "axios";
import { useToast } from "../../../../components/ui/use-toast";
import Objectives from "../page";

interface ObjectiveListProps {
    employee: Employee;
    onSubmit: (objective: Partial<Objective>[]) => any;
    objectives: Partial<Objective>[];
}

const ObjectiveList: React.FC<ObjectiveListProps> = ({
    objectives,
    employee,
    onSubmit,
}) => {
    const { user } = useAuth();
    const data = useObjectivesDataStore();
    const activeStep = useObjectivesDataStore(selectActiveStep);
    return (
        <>
            {user && (
                <div className="relative flex h-full w-[275px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white shadow-sm transition-all">
                    <ObjectiveHeaderBar
                        user={user}
                        data={data}
                        objectives={objectives}
                        employeeId={employee.employeeId}
                        employee={employee}
                    />
                    <ObjectiveListComponent
                        employeeId={user.employeeId}
                        data={data}
                        objectives={objectives}
                        _employeeId={employee.employeeId}
                    />
                    {user.employeeId == employee.employeeId &&
                    objectives.length > 0 ? (
                        objectives.length < 3 ? (
                            <div className="w-full items-center justify-center p-2">
                                <Chip variant="background">
                                    <Icon
                                        icon="mdi:alert"
                                        className="mr-1"
                                        fontSize={14}
                                    />
                                    You must have at least 3 objectives.
                                </Chip>
                            </div>
                        ) : (
                            <div className="w-full items-center justify-center p-2 pb-8">
                                <Chip variant="background">
                                    <Icon
                                        icon="mdi:alert"
                                        className="mr-1"
                                        fontSize={14}
                                    />
                                    You can only have up to 5 objectives.
                                </Chip>
                            </div>
                        )
                    ) : null}

                    {user.employeeId == employee.supervisorId &&
                        objectives.filter((obj) => obj.status !== "draft")
                            .length == 0 && (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-zinc-300">
                                <Icon
                                    icon="fluent:dust-20-filled"
                                    fontSize={28}
                                />
                                <h1 className="text-md font-bold">
                                    No objective has been submitted yet.
                                </h1>
                            </div>
                        )}
                    <ObjectiveBottomActionBar
                        employee={employee}
                        user={user}
                        objectives={objectives}
                        activeStep={activeStep}
                    />
                </div>
            )}
        </>
    );
};

function ObjectiveHeaderBar(props: {
    user: Employee;
    employee: Employee;
    employeeId: number;
    objectives: Partial<Objective>[];
    data: { objectivesLocal: any; setObjectivesLocal: (arg0: any[]) => void };
}) {
    const [creating, setCreating] = useState<boolean>(false);
    const { fetchObjectives } = useObjectivesDataStore();
    const { toast } = useToast();

    async function createObjective() {
        setCreating(true);
        axios
            .post<any, any, { objective: Partial<Objective> }>(
                process.env.NEXT_PUBLIC_API_URL + "/api/objectives/",
                {
                    objective: {
                        employeeId: props.employeeId,
                        supervisorId: props.user.supervisorId,
                    },
                }
            )
            .then((response) => {
                if (response.status == 201) {
                    fetchObjectives(props.user.employeeId.toString());
                    ``;
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
            })
            .finally(() => {
                setCreating(false);
            });
    }

    return (
        <div className="flex w-full items-center justify-center p-4">
            {props.user.employeeId == props.employeeId &&
                props.objectives.every(
                    (obj) => obj?.evaluationStatus !== "sent"
                ) && (
                    <Button
                        loading={creating}
                        disabled={props.objectives.length >= 5}
                        onClick={() => {
                            createObjective();
                        }}
                        variant="outline"
                    >
                        Add objective
                        <Icon
                            icon="ic:baseline-plus"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                )}
            {props.user.employeeId == props.employee.supervisorId &&
                props.objectives.filter((obj) => obj.status !== "draft")
                    .length > 0 && (
                    <>
                        {props.objectives.some(
                            (obj) => obj?.status == "sent"
                        ) ? (
                            <Chip className="gap-1 rounded-lg" variant="alert">
                                {
                                    props.objectives.filter(
                                        (obj) => obj.status == "sent"
                                    ).length
                                }{" "}
                                objective(s) left to review
                                <Icon
                                    icon="mdi:alert"
                                    className="ml-1"
                                    fontSize={12}
                                />
                            </Chip>
                        ) : (
                            <Chip className="gap-1 rounded-lg" variant="brand">
                                All objectives have been reviewed
                                <Icon
                                    icon="mdi:check-all"
                                    className="ml-1"
                                    fontSize={12}
                                />
                            </Chip>
                        )}
                    </>
                )}
        </div>
    );
}

function ObjectiveListComponent(props: {
    objectives: any[];
    employeeId: any;
    _employeeId: any;
    data: {
        setSelectedObjectiveIndex: (arg0: any) => void;
        selectedObjectiveIndex: any;
    };
}) {
    return (
        <div className="w-full">
            {props.objectives.length == 0 && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-zinc-300">
                    <Icon icon="fluent:dust-20-filled" fontSize={28} />
                    <h1 className="text-md font-bold">
                        No objective has been created yet.
                    </h1>
                </div>
            )}
            {props.objectives
                .filter((objective: { status: string }) =>
                    props.employeeId == props._employeeId
                        ? true
                        : objective?.status != "draft"
                )
                .map(
                    (
                        objective: Partial<Objective>,
                        i: Key | null | undefined
                    ) => (
                        <ObjectiveListItem
                            key={i}
                            data={props.data}
                            objective={objective}
                            i={i}
                        />
                    )
                )}
        </div>
    );
}

function ObjectiveListItem(props: {
    data: {
        setSelectedObjectiveIndex: (arg0: any) => void;
        selectedObjectiveIndex: any;
    };
    i: any;
    objective: Partial<Objective>;
}) {
    return (
        <button
            onClick={() => props.data.setSelectedObjectiveIndex(props.i)}
            className={cn(
                "flex w-full flex-col relative items-between justify-start border-b border-t border-b-zinc-100 border-t-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50",
                {
                    "bg-zinc-50 border-l-4 border-l-green-300":
                        props.i === props.data.selectedObjectiveIndex,
                }
            )}
        >
            <div className="flex flex-col items-start justify-start">
                {(props.objective.status == "draft" ||
                    !props.objective.status) && (
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[10px] font-semibold text-zinc-700">
                        Draft
                        <Icon
                            icon="octicon:issue-draft-16"
                            className="ml-1"
                            fontSize={10}
                        />
                    </div>
                )}
                {props.objective.status == "sent" && (
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[10px] font-semibold text-blue-500">
                        Submitted
                        <Icon
                            icon="mdi:check-all"
                            className="ml-1"
                            fontSize={10}
                        />
                    </div>
                )}
                {props.objective.status == "invalid" && ( // </div>
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-red-100 p-1 px-2 text-[10px] font-semibold text-red-500">
                        Invalid
                        <Icon icon="mdi:alert" className="ml-1" fontSize={10} />
                    </div>
                )}
                {props.objective.status == "ok" && (
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[10px] font-semibold text-green-500">
                        Approved
                        <Icon
                            icon="mdi:check-all"
                            className="ml-1"
                            fontSize={10}
                        />
                    </div>
                )}
                <p className="mt-2 text-[8px] font-medium text-zinc-300">
                    OBJECTIVE TITLE
                </p>
                <p className="w-[200px] truncate text-start text-xs font-bold text-zinc-700">
                    {props.objective.title ? props.objective.title : "Untitled"}
                </p>
            </div>
            <div></div>
        </button>
    );
}

function ObjectiveBottomActionBar({
    employee,
    user,
    objectives,
    activeStep,
}: {
    employee: Employee;
    user: Employee;
    objectives: Partial<Objective>[];
    activeStep: number;
}) {
    const data = useObjectivesDataStore();
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    function submitObjectives(objective: Partial<Objective>[]) {
        setLoading(true);
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/api/objectives/bulk", {
                objectives,
            })
            .then((response) => {
                if (response.status == 201) {
                    data.fetchObjectives(employee.employeeId.toString());
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
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <div className="mb-4 mt-auto flex w-full items-center justify-between px-4">
                {/* Status Chip */}
                {/* {objectives.length > 0 && (
                    <div className="flex items-center justify-between">
                        {objectives.some((obj) => obj.status == "draft") && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[10px] font-semibold text-zinc-700">
                                Draft
                                <Icon
                                    icon="octicon:issue-draft-16"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {objectives.every((obj) => obj.status == "sent") && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[10px] font-semibold text-blue-500">
                                Submitted
                                <Icon
                                    icon="mdi:check-all"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {objectives.some((obj) => obj.status == "invalid") && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-orange-100 p-1 px-2 text-[10px] font-semibold text-orange-500">
                                Rejected
                                <Icon
                                    icon="mdi:alert"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {objectives.every((obj) => obj.status == "ok") && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[10px] font-semibold text-green-500">
                                Approved
                                <Icon
                                    icon="mdi:check-all"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                    </div>
                )} */}
                {/* Submission button */}
                {user.employeeId == employee.employeeId && (
                    <>
                        {objectives.some((obj) => obj.status != "ok") && (
                            <Button
                                loading={loading}
                                className=""
                                disabled={
                                    objectives.length < 3 ||
                                    objectives.length > 5 ||
                                    objectives.some(
                                        (objective) =>
                                            !objective.title ||
                                            !objective.deadline ||
                                            !objective.kpi ||
                                            !objective.description ||
                                            !objective.successConditions
                                    )
                                }
                                onClick={() => {
                                    const temp = [...objectives];
                                    temp.forEach((obj, i, arr) => {
                                        arr[i].status =
                                            obj.status == "ok" ? "ok" : "sent";
                                    });
                                    submitObjectives(temp);
                                }}
                                variant="primary"
                            >
                                Submit for validation
                                <Icon
                                    icon="material-symbols:upload"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default ObjectiveList;
