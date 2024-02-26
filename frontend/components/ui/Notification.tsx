import { Employee, Status } from "@/global";
import { Icon } from "@iconify/react/dist/iconify.js";

import React from "react";
import Button from "./Button";
import Link from "next/link";

function Notification({ user }: { user: Employee }) {
    return (
        <Link
            href={`/objectives/${user.employeeId}`}
            className="flex items-center justify-between gap-4 p-2"
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
            <Button variant="outline">
                Access
                <Icon
                    icon="ph:arrow-up-right-bold"
                    className="ml-1"
                    fontSize={14}
                />
            </Button>
        </Link>
    );
}

export default Notification;
