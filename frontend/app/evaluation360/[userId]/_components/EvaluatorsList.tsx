"use client";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Modal from "@/components/ui/Modal";
import { cn } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useEvaluationDataStore } from "../_store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function EvaluatorsList({
    evaluation,
}: {
    evaluation?: Evaluation360 | null | undefined;
}) {
    const { user } = useAuth();
    const { employee, evaluators } = useEvaluationDataStore();
    if (!user || !employee) return null;
    return (
        <div className="flex w-full flex-1 items-center justify-between rounded-md border border-zinc-200 bg-white p-4 text-center shadow-sm transition-all">
            {evaluation ? (
                <div className="flex h-full w-full flex-col items-start justify-end gap-2">
                    <div className="flex w-full items-end justify-between">
                        <ListComponent evaluation={evaluation} />
                        <div className="flex h-full items-start justify-center gap-2">
                            {evaluators &&
                            evaluators.length > 0 &&
                            evaluators.some((obj) => obj.evaluatorGrade) ? (
                                <div className="flex flex-col items-end justify-center rounded-md border border-zinc-100 p-2 text-end">
                                    <p className="text-[10px] font-bold text-zinc-400">
                                        Evaluation grade
                                    </p>
                                    <p className="text-2xl font-bold text-zinc-700">
                                        {evaluators
                                            .filter((obj) => obj.evaluatorGrade)
                                            .reduce(
                                                (prev, cur) =>
                                                    prev +
                                                    (cur.evaluatorGrade ?? 0),
                                                0
                                            ) /
                                            evaluators.filter(
                                                (obj) => obj.evaluatorGrade
                                            ).length}
                                        <span className="text-xs font-bold text-zinc-400">
                                            /5
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {user.employeeId == employee.employeeId && (
                                        <UserSideBar
                                            user={user}
                                            employee={employee}
                                            evaluation={evaluation}
                                        />
                                    )}
                                    {user.employeeId ==
                                        employee.supervisorId && (
                                        <SupervisorSidebar
                                            user={user}
                                            employee={employee}
                                            evaluation={evaluation}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <EvaluationCreateComponent employee={employee} />
            )}
        </div>
    );
}

function UserSideBar({
    user,
    employee,
    evaluation,
}: {
    user: Employee;
    employee: Employee;
    evaluation: Evaluation360;
}) {
    const { evaluators, fetchEvaluation } = useEvaluationDataStore();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();

    async function postEvaluation(evaluation: Evaluation360): Promise<any> {
        try {
            const result = await axios
                .put(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation360/${evaluation.evaluation360Id}`,
                    {
                        evaluation,
                    }
                )
                .then((res) => {
                    if (res.status == 201) {
                        toast({
                            description: "Successfully updated 360 evaluation.",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    });
                    return null;
                })
                .finally(() => {
                    fetchEvaluation(employee.employeeId.toString());
                });
            return result;
        } catch (error) {}
    }

    return (
        <div className="flex h-full w-full flex-col items-end justify-start gap-2">
            <EvaluationStatusBadge evaluation={evaluation} />
            <Button
                variant="primary"
                loading={isSubmitting}
                disabled={
                    evaluators?.length == 0 ||
                    evaluation.evaluationStatus == "sent" ||
                    evaluators?.some(
                        (obj) => obj.evaluatorGrade || obj.evaluatorComment
                    )
                }
                onClick={() => {
                    if (evaluation) {
                        setIsSubmitting(true);
                        const obj = { ...evaluation };
                        obj.evaluationStatus = "sent";
                        postEvaluation(obj).finally(() =>
                            setIsSubmitting(false)
                        );
                    }
                }}
            >
                Submit list to supervisor
                <Icon
                    icon="mingcute:mail-send-fill"
                    className="ml-1"
                    fontSize={14}
                />
            </Button>
        </div>
    );
}

function SupervisorSidebar({
    user,
    employee,
    evaluation,
}: {
    user: Employee;
    employee: Employee;
    evaluation: Evaluation360;
}) {
    const { evaluators, fetchEvaluation } = useEvaluationDataStore();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();

    async function postEvaluation(evaluation: Evaluation360): Promise<any> {
        try {
            const result = await axios
                .put(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation360/${evaluation.evaluation360Id}`,
                    {
                        evaluation,
                    }
                )
                .then((res) => {
                    if (res.status == 201) {
                        toast({
                            description: "Successfully updated 360 evaluation.",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    });
                    return null;
                })
                .finally(() => {
                    fetchEvaluation(employee.employeeId.toString());
                });
            return result;
        } catch (error) {}
    }

    return (
        <div className="flex h-full w-full flex-col items-end justify-end gap-2">
            <EvaluationStatusBadge evaluation={evaluation} />
            <Button
                variant="primary"
                loading={isSubmitting}
                disabled={
                    evaluators?.length == 0 ||
                    evaluation.evaluationStatus == "ok" ||
                    evaluators?.some(
                        (obj) => obj.evaluatorGrade || obj.evaluatorComment
                    )
                }
                onClick={() => {
                    if (evaluation) {
                        setIsSubmitting(true);
                        const obj = { ...evaluation };
                        obj.evaluationStatus = "ok";
                        postEvaluation(obj).finally(() =>
                            setIsSubmitting(false)
                        );
                    }
                }}
            >
                Mark as OK
                <Icon icon="mdi:check-all" className="ml-1" fontSize={14} />
            </Button>
            <Button
                variant="alertOutline"
                loading={isSubmitting}
                disabled={
                    evaluators?.length == 0 ||
                    evaluation.evaluationStatus == "invalid" ||
                    evaluators?.some(
                        (obj) => obj.evaluatorGrade || obj.evaluatorComment
                    )
                }
                onClick={() => {
                    if (evaluation) {
                        setIsSubmitting(true);
                        const obj = { ...evaluation };
                        obj.evaluationStatus = "invalid";
                        postEvaluation(obj).finally(() =>
                            setIsSubmitting(false)
                        );
                    }
                }}
            >
                Mark as invalid
                <Icon
                    icon="mingcute:mail-send-fill"
                    className="ml-1"
                    fontSize={14}
                />
            </Button>
        </div>
    );
}

function EvaluationCreateComponent({ employee }: { employee: Employee }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchEvaluation } = useEvaluationDataStore();
    async function createEvaluation() {
        try {
            setLoading(true);
            const result = await axios
                .post(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation360`, {
                    evaluation: {
                        employeeId: employee.employeeId,
                        supervisorId: employee.supervisorId,
                    },
                })
                .then((res) => {
                    if (res.status == 201) {
                        fetchEvaluation(employee.employeeId.toString());
                        return true;
                    } else {
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return false;
                })
                .finally(() => {
                    setLoading(false);
                });
            return result;
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-300">
            <Icon icon="fluent:dust-20-filled" fontSize={32} />
            <h1 className="text-md font-bold">
                A 360 evaluation has not been started yet.
            </h1>
            {employee.employeeId == user?.employeeId && (
                <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    onClick={() => createEvaluation()}
                >
                    Start 360 Evaluation
                    <Icon
                        icon="material-symbols:bolt"
                        className="ml-1"
                        fontSize={14}
                    />
                </Button>
            )}
        </div>
    );
}

function ListComponent({ evaluation }: { evaluation: Evaluation360 }) {
    const { user } = useAuth();
    const { evaluators, fetchEvaluators, employee } = useEvaluationDataStore();
    const [isAdding, setIsAdding] = React.useState(false);

    useEffect(() => {
        fetchEvaluators(evaluation.evaluation360Id.toString());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (evaluators == undefined || !user) return null;
    return (
        <div className="flex h-full flex-col items-start justify-start gap-2">
            <Chip>
                My evaluators
                <Icon icon="solar:list-bold" className="ml-1" fontSize={14} />
            </Chip>
            <div className="flex items-center justify-start gap-2">
                {evaluators
                    .filter(
                        (obj) =>
                            obj.evaluatorId == user.employeeId ||
                            user.employeeId == employee?.supervisorId ||
                            user.employeeId == employee?.employeeId
                    )
                    .map(
                        (
                            evaluator: Evaluator360,
                            i: React.Key | null | undefined
                        ) => (
                            <ListItem key={i} evaluator={evaluator} />
                        )
                    )}

                {evaluators.length < 3 &&
                    evaluation.evaluationStatus !== "ok" &&
                    evaluation.evaluationStatus !== "sent" &&
                    user.employeeId == employee?.employeeId && (
                        <button
                            onClick={() => {
                                setIsAdding(true);
                            }}
                            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 p-4 text-xs font-semibold transition-all hover:bg-zinc-50 active:scale-95"
                        >
                            <p>Add an evaluator</p>
                            <Icon icon="akar-icons:plus" className="" />
                        </button>
                    )}

                <Modal show={isAdding} onClose={() => setIsAdding(false)}>
                    <AssignmentModal
                        evaluators={evaluators}
                        setIsAdding={setIsAdding}
                    />
                </Modal>
            </div>
        </div>
    );
}

function ListItem({ evaluator }: { evaluator: Evaluator360 }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [user, setUser] = useState<Employee>();
    const {
        fetchEvaluators,
        evaluation,
        setSelectedEmployeeId,
        selectedEmployeeId,
    } = useEvaluationDataStore();

    async function fetchEmployee(userId: string) {
        try {
            const employee = await axios
                .get<Employee>(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${userId}`
                )
                .then((res) => res.data)
                .catch((err) => {
                    console.log(err);
                    return null;
                });
            if (employee) setUser(employee);
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteEmployee(userId: string) {
        try {
            if (evaluation) {
                const result = await axios
                    .delete(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/evaluator360/${evaluator.evaluator360Id}`
                    )
                    .then((res) => {
                        if (res.status == 200) {
                            return true;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        return false;
                    })
                    .finally(() => {
                        setIsDeleting(false);
                        fetchEvaluators(evaluation.evaluation360Id.toString());
                    });
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchEmployee(evaluator.evaluatorId.toString());
    }, [evaluator]);

    if (!user) return null;
    return (
        <>
            <button
                onClick={() => {
                    if (evaluation && evaluation.evaluationStatus == "ok") {
                        setSelectedEmployeeId(user.employeeId);
                    }
                    if (evaluation && evaluation.evaluationStatus == "sent") {
                    }
                    if (evaluation && evaluation.evaluationStatus == "draft") {
                        setIsDeleting(true);
                    }
                }}
                className="flex flex-col items-center justify-center rounded-lg border border-dashed border-green-300 bg-transparent p-3 px-4 text-xs font-semibold text-green-600 transition-all hover:bg-zinc-50 active:scale-95"
            >
                {evaluator.evaluatorGrade && evaluator.evaluatorComment ? (
                    <Chip variant="brand" size="xs" className="mb-2">
                        Submitted
                        <Icon
                            icon="bi:check-all"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Chip>
                ) : (
                    <Chip variant="brand" size="xs" className="mb-2">
                        Pending
                        <Icon
                            icon="ph:circle-dashed"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Chip>
                )}
                <p>{user.firstName + " " + user.lastName}</p>
                <p className="whitespace-nowrap text-[10px]">
                    {evaluator.evaluatorJobTitle}
                </p>
            </button>
            <Modal show={isDeleting} onClose={() => setIsDeleting(false)}>
                <div className="flex w-[500px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
                    <div className="flex w-full flex-col items-start justify-between">
                        <p className="text-xl font-bold text-zinc-700">
                            Remove this evaluator ?
                        </p>
                        <p className="text-xs text-muted-foreground">
                            This action cannot be undone.
                        </p>
                        <div className="mt-4 flex w-full items-center justify-end gap-2">
                            <Button
                                onClick={() => {
                                    setIsDeleting(false);
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
                                    deleteEmployee(
                                        evaluator.evaluatorId.toString()
                                    );
                                }}
                                variant="alert"
                            >
                                Remove
                                <Icon
                                    icon="gridicons:trash"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

function AssignmentModal(props: {
    setIsAdding: (arg0: boolean) => void;
    evaluators: Evaluator360[];
}) {
    const [search, setSearch] = useState<string>("");
    const [employees, setEmployees] = useState<Employee[] | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
    const { evaluation, fetchEvaluators } = useEvaluationDataStore();
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const memoizedSearchQuery = useMemo(() => search, [search]);

    async function postEvaluator360() {
        try {
            if (evaluation && selectedEmployee) {
                setLoading(true);
                const result = await axios
                    .post(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/evaluator360`,
                        {
                            evaluation: {
                                evaluationId: evaluation.evaluation360Id,
                                evaluatorId: selectedEmployee.employeeId,
                                evaluatorJobTitle: selectedEmployee.jobTitle,
                            },
                        }
                    )
                    .then((res) => {
                        if (res.status == 201) {
                            fetchEvaluators(
                                evaluation.evaluation360Id.toString()
                            );
                            return true;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        return false;
                    })
                    .finally(() => {
                        props.setIsAdding(false);
                        setSearch("");
                        setEmployees(null);
                        setSelectedEmployee(undefined);
                        setLoading(false);
                    });

                return result;
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        async function fetchEmployees() {
            axios
                .get<Employee[]>(
                    process.env.NEXT_PUBLIC_API_URL +
                        "/api/employees/?search=" +
                        memoizedSearchQuery
                )
                .then((response) => {
                    if (response.data) {
                        setEmployees(
                            response.data.filter(
                                (emp, i) =>
                                    props.evaluators.every(
                                        (e) => e.evaluatorId !== emp.employeeId
                                    ) && emp.employeeId !== user?.employeeId
                            )
                        );
                    } else {
                        setEmployees([]);
                    }
                })
                .catch((err) => console.log(err));
        }
        // Only fetch data if the search term is not empty
        if (memoizedSearchQuery !== "" && memoizedSearchQuery.length >= 3) {
            fetchEmployees();
        } else {
            setEmployees([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memoizedSearchQuery, search]);

    return (
        <form
            onSubmit={(e) => {
                if (selectedEmployee) {
                    e.preventDefault();
                    postEvaluator360();
                    props.setIsAdding(false);
                }
            }}
        >
            <div className="flex h-[450px] w-[600px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-700">
                    Assigment
                    <Icon
                        icon="ic:baseline-star"
                        className="ml-1"
                        fontSize={10}
                    />
                </div>
                {/* Header */}
                <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-2xl font-bold text-zinc-700">
                        Add an evaluator
                    </p>
                </div>
                {/* Search bar */}
                <div className="relative mt-4 flex w-full items-center justify-start gap-1">
                    <input
                        required
                        autoCorrect="off"
                        spellCheck="false"
                        type="text"
                        value={search ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search for a staff member"
                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                    />
                    <Icon
                        icon="material-symbols:search"
                        className="absolute right-2 ml-1 text-zinc-300"
                        fontSize={16}
                    />
                </div>
                <div className="mt-4 flex max-h-[300px] w-full flex-1 flex-col gap-1 overflow-y-scroll">
                    {search.length < 3 || employees == null ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-300">
                            <Icon
                                icon="material-symbols:search"
                                className=""
                                fontSize={64}
                            />
                            <h1 className="text-xl font-bold">
                                Start typing more than 3 letters.
                            </h1>
                        </div>
                    ) : employees.length > 0 ? (
                        employees.map((employee, i) => {
                            return (
                                <button
                                    type="button"
                                    onClick={() => {
                                        selectedEmployee?.employeeId ==
                                        employee.employeeId
                                            ? setSelectedEmployee(undefined)
                                            : setSelectedEmployee(employee);
                                    }}
                                    className={cn(
                                        "grid grid-cols-5 w-full relative items-center justify-start rounded-md border-b border-b-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50",
                                        `${
                                            selectedEmployee?.employeeId ==
                                                employee.employeeId &&
                                            "bg-zinc-100"
                                        }`
                                    )}
                                    key={i}
                                >
                                    <div className="flex items-center justify-start">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-zinc-50">
                                            {employee.firstName.charAt(0) +
                                                employee.lastName.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-center">
                                        <p className="text-[8px] font-medium text-zinc-300">
                                            LAST NAME
                                        </p>
                                        <p
                                            className={cn(
                                                "text-xs text-zinc-700 max-w-[150px] truncate font-medium"
                                            )}
                                        >
                                            {employee.lastName}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start justify-center">
                                        <p className="text-[8px] font-medium text-zinc-300">
                                            FIRST NAME
                                        </p>
                                        <p className="max-w-[150px] truncate text-xs font-medium text-zinc-700">
                                            {employee.firstName}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start justify-center">
                                        <p className="text-[8px] font-medium text-zinc-300">
                                            MATRICULE
                                        </p>
                                        <p className="max-w-[150px] truncate text-xs font-medium text-zinc-700">
                                            {employee.matricule}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end justify-center">
                                        {selectedEmployee?.employeeId ==
                                        employee.employeeId ? (
                                            <Icon
                                                icon="mdi:checkbox-marked-circle"
                                                className="ml-1 text-green-500"
                                                fontSize={24}
                                            />
                                        ) : (
                                            <Icon
                                                icon="mdi:checkbox-blank-circle-outline"
                                                className="ml-1 text-green-300"
                                                fontSize={24}
                                            />
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-300">
                            <Icon
                                icon="fluent:dust-20-filled"
                                className=""
                                fontSize={64}
                            />
                            <h1 className="text-xl font-bold">
                                No employee found.
                            </h1>
                        </div>
                    )}
                </div>
                {/* Assignment button */}
                {
                    <div className="mt-4 flex w-full items-center justify-end gap-2">
                        <Button
                            type="submit"
                            disabled={!selectedEmployee}
                            variant="primary"
                        >
                            Add evaluator
                            <Icon
                                icon="ic:baseline-plus"
                                className="ml-1"
                                fontSize={14}
                            />
                        </Button>
                    </div>
                }
            </div>
        </form>
    );
}

function EvaluationStatusBadge({ evaluation }: { evaluation: Evaluation360 }) {
    switch (evaluation.evaluationStatus) {
        case "draft":
            return (
                <Chip variant="primary">
                    Draft
                    <Icon
                        icon="ph:newspaper-clipping-fill"
                        className="ml-1"
                        fontSize={14}
                    />
                </Chip>
            );
        case "sent":
            return (
                <Chip variant="blue">
                    Submitted
                    <Icon
                        icon="mingcute:mail-send-fill"
                        className="ml-1"
                        fontSize={14}
                    />
                </Chip>
            );
        case "ok":
            return (
                <Chip variant="brand">
                    OK
                    <Icon icon="mdi:check-all" className="ml-1" fontSize={14} />
                </Chip>
            );
        case "invalid":
            return (
                <Chip variant="destructive">
                    Invalid
                    <Icon
                        icon="ion:alert-sharp"
                        className="ml-1"
                        fontSize={14}
                    />
                </Chip>
            );

        default:
            break;
    }
}

export default EvaluatorsList;
