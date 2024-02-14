"use client";
// import OrgChart from "@/app/management/organogram/_components/OrgChart";
import { useEffect } from "react";
import OrgChart from "./_components/OrgChart";

export default function Management() {
    useEffect(() => {}, []);
    return (
        <main className="flex h-full w-full flex-1 items-start justify-center gap-4 p-8">
            <OrgChart />
        </main>
    );
}
