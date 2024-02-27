import { Icon } from "@iconify/react/dist/iconify.js";

import React, { use, useEffect } from "react";
import Button from "./Button";
import Link from "next/link";
import axios from "axios";

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
                        objectives yet.
                    </p>
                </Link>
            )}
            {supervisorStatus.objectiveStatus ===
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
                        You have not evaluated{" "}
                        <b>{employee.firstName}&apos;s</b> objectives yet.
                    </p>
                </Link>
            )}
            {supervisorStatus.evaluationStatus ===
                "SUPERVISOR_EVALUATION_RATED" && (
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
                    href={`/objectives/${user.employeeId}`}
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
            {status.objectiveStatus !== "OBJECTIVE_IDLE" && (
                <Link
                    className="flex items-center justify-start gap-4 p-2 px-4 hover:bg-zinc-50"
                    href={`/objectives/${user.employeeId}`}
                >
                    {status.objectiveStatus === "OBJECTIVE_EMPTY" && (
                        <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                                <Icon
                                    icon="mdi:alert"
                                    fontSize={16}
                                    className="text-yellow-600"
                                />
                            </div>
                            <p className="whitespace-nowrap text-xs">
                                You have not submitted <b>your objectives</b>{" "}
                                yet.
                            </p>
                        </>
                    )}
                    {status.objectiveStatus === "OBJECTIVE_SENT" && (
                        <>
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
                        </>
                    )}
                    {status.objectiveStatus === "OBJECTIVE_INVALID" && (
                        <>
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
                        </>
                    )}
                    {status.objectiveStatus === "OBJECTIVE_OK" && (
                        <>
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
                        </>
                    )}
                    {status.objectiveStatus === "OBJECTIVE_UNRATED" && (
                        <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                                <Icon
                                    icon="mdi:alert"
                                    fontSize={16}
                                    className="text-yellow-600"
                                />
                            </div>
                            <p className="whitespace-nowrap text-xs">
                                You have not <b>evaluated your objectives</b>{" "}
                                yet.
                            </p>
                        </>
                    )}
                </Link>
            )}
        </>
    );
}

function Notification({ user }: { user: Employee }) {
    const [status, setStatus] = React.useState<Status>();

    async function getStatus() {
        axios
            .get<Status>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    user?.employeeId +
                    "/status"
            )
            .then((response) => {
                if (response.data) {
                    console.log(response.data);
                    setStatus(response.data);
                } else {
                }
            })
            .catch((err) => console.log(err));
    }
    useEffect(() => {
        getStatus();
    }, [user]);

    if (!status) return;
    return (
        <div className="flex flex-col">
            <ObjectiveNotification user={user} status={status} />
            <SelfEvaluationNotification user={user} status={status} />
            {status.supervisorStatus?.map((supervisorStatus, i) => (
                <SupervisorNotification
                    key={i}
                    user={user}
                    supervisorStatus={supervisorStatus}
                />
            ))}
        </div>
    );
}

export default Notification;
