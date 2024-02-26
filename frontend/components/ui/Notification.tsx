import {
    Employee,
    StaffObjectiveStatus,
    StaffSelfEvaluationStatus,
    Status,
    SupervisorEvaluationStatus,
} from "@/global";
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
// }[];

// export type Status = {
//     objectiveStatus: StaffObjectiveStatus;
//     selfEvaluationStatus: StaffSelfEvaluationStatus;
//     supervisorStatus?: SupervisorStatus;
// };

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
                    className="flex items-center justify-between gap-4 p-2"
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
                            <Button variant="outline">
                                Access
                                <Icon
                                    icon="ph:arrow-up-right-bold"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
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
                            <Button variant="outline">
                                Access
                                <Icon
                                    icon="ph:arrow-up-right-bold"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
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
                            <Button variant="outline">
                                Access
                                <Icon
                                    icon="ph:arrow-up-right-bold"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
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
                            <Button variant="outline">
                                Access
                                <Icon
                                    icon="ph:arrow-up-right-bold"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
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
                            <Button variant="outline">
                                Access
                                <Icon
                                    icon="ph:arrow-up-right-bold"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
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
    }, []);
    if (!status) return;
    return (
        <>
            <ObjectiveNotification user={user} status={status} />
        </>
    );
}

export default Notification;
