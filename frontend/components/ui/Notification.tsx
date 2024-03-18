import { Icon } from "@iconify/react/dist/iconify.js";

import React, { use, useEffect, useMemo } from "react";
import Button from "./Button";
import Link from "next/link";
import axios from "axios";
import { useObjectivesDataStore } from "@/app/objectives/[userId]/_store/useStore";
import { useEvaluationDataStore } from "@/app/evaluation360/[userId]/_store/useStore";

// type StaffObjectiveStatus =
//     | "OBJECTIVE_IDLE"
//     | "OBJECTIVE_EMPTY"
//     | "OBJECTIVE_SENT"
//     | "OBJECTIVE_INVALID"
//     | "OBJECTIVE_OK"
//     | "OBJECTIVE_UNRATED"
//     | "OBJECTIVE_RATED";
// type StaffSelfEvaluationStatus =
//     | "SELF_EVALUATION_IDLE"
//     | "SELF_EVALUATION_EMPTY"
//     | "SELF_EVALUATION_SENT";
// type SupervisorObjectiveStatus =
//     | "SUPERVISOR_OBJECTIVE_IDLE"
//     | "SUPERVISOR_OBJECTIVE_UNREVIEWED"
//     | "SUPERVISOR_OBJECTIVE_REVIEWED";
// type SupervisorEvaluationStatus =
//     | "SUPERVISOR_EVALUATION_IDLE"
//     | "SUPERVISOR_EVALUATION_UNRATED"
//     | "SUPERVISOR_EVALUATION_RATED";

// type SupervisorStatus = {
//     objectiveStatus: SupervisorObjectiveStatus;
//     evaluationStatus: SupervisorEvaluationStatus;
//     employeeId: number;
// };

// export type Status = {
//     objectiveStatus: StaffObjectiveStatus;
//     selfEvaluationStatus: StaffSelfEvaluationStatus;
//     supervisorStatus?: SupervisorStatus[];
// };

function SupervisorNotification({
    user,
    supervisorStatus,
}: {
    user: Employee;
    supervisorStatus: SupervisorStatus;
}) {
    const [employee, setEmployee] = React.useState<Employee>();
    async function getEmployee() {
        await axios
            .get<Employee>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    supervisorStatus.employeeId
            )
            .then((response) => {
                if (response.data) {
                    setEmployee(response.data);
                } else {
                }
            })
            .catch((err) => console.log(err));
    }
    useEffect(() => {
        getEmployee();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!employee) return;
    return (
        <>
            {supervisorStatus.objectiveStatus ===
                "SUPERVISOR_OBJECTIVE_UNVALIDATED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/objectives/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                        <Icon
                            icon="mdi:alert"
                            fontSize={16}
                            className="text-yellow-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have not validated{" "}
                        <b>{employee.firstName}&apos;s</b> objectives yet.
                    </p>
                </Link>
            )}
            {supervisorStatus.objectiveStatus ===
                "SUPERVISOR_OBJECTIVE_UNREVIEWED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/objectives/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                        <Icon
                            icon="mdi:alert"
                            fontSize={16}
                            className="text-yellow-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have not reviewed <b>{employee.firstName}&apos;s</b>{" "}
                        objective progress yet.
                    </p>
                </Link>
            )}
            {supervisorStatus.objectiveStatus ===
                "SUPERVISOR_OBJECTIVE_UNRATED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/objectives/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                        <Icon
                            icon="mdi:alert"
                            fontSize={16}
                            className="text-yellow-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have not evaluated{" "}
                        <b>{employee.firstName}&apos;s</b> objectives.
                    </p>
                </Link>
            )}
            {/* {supervisorStatus.objectiveStatus ===
                "SUPERVISOR_OBJECTIVE_REVIEWED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/objectives/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                        <Icon
                            icon="mdi:check-all"
                            fontSize={16}
                            className="text-green-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have reviewed <b>{employee.firstName}&apos;s</b>{" "}
                        objectives.
                    </p>
                </Link>
            )}
            {supervisorStatus.objectiveStatus ===
                "SUPERVISOR_OBJECTIVE_RATED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/objectives/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                        <Icon
                            icon="mdi:check-all"
                            fontSize={16}
                            className="text-green-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have evaluated <b>{employee.firstName}&apos;s</b>{" "}
                        objectives.
                    </p>
                </Link>
            )}
            {supervisorStatus.objectiveStatus ===
                "SUPERVISOR_OBJECTIVE_VALIDATED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/objectives/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                        <Icon
                            icon="mdi:check-all"
                            fontSize={16}
                            className="text-green-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have validated <b>{employee.firstName}&apos;s</b>{" "}
                        objectives.
                    </p>
                </Link>
            )} */}
            {supervisorStatus.evaluationStatus ===
                "SUPERVISOR_EVALUATION_UNRATED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/objectives/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                        <Icon
                            icon="mdi:alert"
                            fontSize={16}
                            className="text-yellow-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have not evaluated <b>{employee.firstName}</b> yet.
                    </p>
                </Link>
            )}

            {supervisorStatus.evaluation360Status ===
                "SUPERVISOR_EVALUATION360_UNREVIEWED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/evaluation360/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                        <Icon
                            icon="mdi:alert"
                            fontSize={16}
                            className="text-yellow-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have not reviewed <b>{employee.firstName}</b>&apos;s
                        360 evaluators yet.
                    </p>
                </Link>
            )}
            {/* {supervisorStatus.evaluationStatus === "SUPERVISOR_EVALUATION_RATED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/evaluation360/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                        <Icon
                            icon="mdi:check-all"
                            fontSize={16}
                            className="text-green-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have reviewed <b>{employee.firstName}&apos;s</b>{" "}
                        evaluators.
                    </p>
                </Link>
            )} */}
        </>
    );
}

function OtherEvaluation360Notification({
    user,
    otherEvaluation360,
}: {
    user: Employee;
    otherEvaluation360: OtherEvaluation360;
}) {
    const [employee, setEmployee] = React.useState<Employee>();

    async function getEmployee() {
        await axios
            .get<Employee>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    otherEvaluation360.employeeId
            )
            .then((response) => {
                if (response.data) {
                    setEmployee(response.data);
                } else {
                }
            })
            .catch((err) => console.log(err));
    }
    useEffect(() => {
        getEmployee();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!employee) return;
    return (
        <>
            {otherEvaluation360.evaluationStatus ===
                "EVALUATION360_UNRATED" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/evaluation360/${employee.employeeId}`}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                        <Icon
                            icon="mdi:alert"
                            fontSize={16}
                            className="text-yellow-600"
                        />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                        You have not submitted{" "}
                        <b>{employee.firstName}&apos;s</b> 360 yet.
                    </p>
                </Link>
            )}
        </>
    );
}
function SelfEvaluationNotification({
    user,
    status,
}: {
    user: Employee;
    status: Status;
}) {
    return (
        <>
            {status.selfEvaluationStatus !== "SELF_EVALUATION_IDLE" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/objectives/${user.employeeId}/?step=3`}
                >
                    {status.selfEvaluationStatus ===
                        "SELF_EVALUATION_EMPTY" && (
                        <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                                <Icon
                                    icon="mdi:alert"
                                    fontSize={16}
                                    className="text-yellow-600"
                                />
                            </div>
                            <p className="whitespace-nowrap text-xs">
                                You have not submitted{" "}
                                <b>your self-evaluation</b> yet.
                            </p>
                        </>
                    )}
                    {status.selfEvaluationStatus === "SELF_EVALUATION_SENT" && (
                        <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                                <Icon
                                    icon="mdi:check-all"
                                    fontSize={16}
                                    className="text-green-600"
                                />
                            </div>
                            <p className="whitespace-nowrap text-xs">
                                You have submitted <b>your self-evaluation</b>.
                            </p>
                        </>
                    )}
                </Link>
            )}
        </>
    );
}

function ObjectiveNotification({
    user,
    status,
}: {
    user: Employee;
    status: Status;
}) {
    return (
        <>
            {status.objectiveStatus === "OBJECTIVE_EMPTY" && (
                <>
                    <Link
                        className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                        href={`/objectives/${user.employeeId}`}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                            <Icon
                                icon="mdi:alert"
                                fontSize={16}
                                className="text-yellow-600"
                            />
                        </div>
                        <p className="whitespace-nowrap text-xs">
                            You have not submitted <b>your objectives</b> yet.
                        </p>
                    </Link>
                </>
            )}
            {status.objectiveStatus === "OBJECTIVE_SENT" && (
                <>
                    <Link
                        className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                        href={`/objectives/${user.employeeId}`}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                            <Icon
                                icon="mdi:check-all"
                                fontSize={16}
                                className="text-green-600"
                            />
                        </div>
                        <p className="whitespace-nowrap text-xs">
                            You have submitted <b>your objectives</b>.
                        </p>
                    </Link>
                </>
            )}
            {status.objectiveStatus === "OBJECTIVE_INVALID" && (
                <>
                    <Link
                        className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                        href={`/objectives/${user.employeeId}`}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-300">
                            <Icon
                                icon="mdi:alert"
                                fontSize={16}
                                className="text-red-600"
                            />
                        </div>
                        <p className="whitespace-nowrap text-xs">
                            Your objectives need to be <b>modified</b>.
                        </p>
                    </Link>
                </>
            )}
            {status.objectiveStatus === "OBJECTIVE_OK" && (
                <>
                    <Link
                        className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                        href={`/objectives/${user.employeeId}`}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                            <Icon
                                icon="mdi:check-all"
                                fontSize={16}
                                className="text-green-600"
                            />
                        </div>
                        <p className="whitespace-nowrap text-xs">
                            Your objectives are <b>approved</b>.
                        </p>
                    </Link>
                </>
            )}
            {status.objectiveStatus === "OBJECTIVE_UNRATED" && (
                <>
                    <Link
                        className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                        href={`/objectives/${user.employeeId}?step=3`}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                            <Icon
                                icon="mdi:alert"
                                fontSize={16}
                                className="text-yellow-600"
                            />
                        </div>
                        <p className="whitespace-nowrap text-xs">
                            You have not <b>evaluated your objectives</b> yet.
                        </p>
                    </Link>
                </>
            )}
            {status.objectiveStatus === "OBJECTIVE_UNREVIEWED" && (
                <>
                    <Link
                        className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                        href={`/objectives/${user.employeeId}?step=2`}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                            <Icon
                                icon="mdi:alert"
                                fontSize={16}
                                className="text-yellow-600"
                            />
                        </div>
                        <p className="whitespace-nowrap text-xs">
                            You have not <b>reviewed your objectives</b> yet.
                        </p>
                    </Link>
                </>
            )}
        </>
    );
}
function Evaluation360Notification({
    user,
    status,
}: {
    user: Employee;
    status: Status;
}) {
    return (
        <>
            {status.evaluation360Status !== "EVALUATION360_IDLE" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/evaluation360/${user.employeeId}`}
                >
                    {status.evaluation360Status === "EVALUATION360_EMPTY" && (
                        <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                                <Icon
                                    icon="mdi:alert"
                                    fontSize={16}
                                    className="text-yellow-600"
                                />
                            </div>
                            <p className="whitespace-nowrap text-xs">
                                You have not submitted{" "}
                                <b>your 360 evaluators</b> yet.
                            </p>
                        </>
                    )}
                    {status.evaluation360Status === "EVALUATION360_SENT" && (
                        <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                                <Icon
                                    icon="mdi:check-all"
                                    fontSize={16}
                                    className="text-green-600"
                                />
                            </div>
                            <p className="whitespace-nowrap text-xs">
                                You have submitted <b>your 360 evaluators</b>.
                            </p>
                        </>
                    )}
                    {status.evaluation360Status === "EVALUATION360_INVALID" && (
                        <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-300">
                                <Icon
                                    icon="mdi:alert"
                                    fontSize={16}
                                    className="text-red-600"
                                />
                            </div>
                            <p className="whitespace-nowrap text-xs">
                                Your 360 evaluators need to be <b>modified</b>.
                            </p>
                        </>
                    )}
                    {status.evaluation360Status === "EVALUATION360_OK" && (
                        <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-300">
                                <Icon
                                    icon="mdi:check-all"
                                    fontSize={16}
                                    className="text-blue-600"
                                />
                            </div>
                            <p className="whitespace-nowrap text-xs">
                                Your 360 evaluators are <b>approved</b>.
                            </p>
                        </>
                    )}
                    {status.evaluation360Status === "EVALUATION360_RATED" && (
                        <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-300">
                                <Icon
                                    icon="mdi:check-all"
                                    fontSize={16}
                                    className="text-green-600"
                                />
                            </div>
                            <p className="whitespace-nowrap text-xs">
                                Your 360 evaluators <b>submitted all</b> their
                                feedback.
                            </p>
                        </>
                    )}
                </Link>
            )}
        </>
    );
}

function Notification({ user, status }: { user: Employee; status: Status }) {
    const { objectives, evaluation } = useObjectivesDataStore();
    const { evaluators } = useEvaluationDataStore();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, objectives, evaluation, evaluators]);

    if (!status) return;
    return (
        <div className="flex flex-col">
            <ObjectiveNotification user={user} status={status} />
            <SelfEvaluationNotification user={user} status={status} />
            <Evaluation360Notification user={user} status={status} />
            {status.supervisorStatus?.map((supervisorStatus, i) => (
                <SupervisorNotification
                    key={i}
                    user={user}
                    supervisorStatus={supervisorStatus}
                />
            ))}

            {status.otherEvaluation360Status.map((otherEvaluation360, i) => (
                <OtherEvaluation360Notification
                    key={i}
                    user={user}
                    otherEvaluation360={otherEvaluation360}
                />
            ))}
        </div>
    );
}

export default Notification;
