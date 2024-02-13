"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import SuperviseeList from "@/app/_components/SuperviseeList";

export default function Dashboard() {
    const [supervisees, setSupervisees] = useState<Employee[] | null>(null);
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            axios
                .get<Employee[]>(
                    process.env.NEXT_PUBLIC_API_URL +
                        "/api/employees/" +
                        user?.employeeId +
                        "/subordinates"
                )
                .then((response) => {
                    if (response.data) {
                        console.log(response.data);
                        setSupervisees(response.data);
                    } else {
                        setSupervisees((prev) => []);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    return (
        <main className="flex h-full w-full flex-1 items-center justify-center gap-4 p-8">
            {supervisees && (
                <>
                    {supervisees.length > 0 ? (
                        <SuperviseeList employees={supervisees} />
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-zinc-300">
                            <Icon icon="fluent:dust-20-filled" fontSize={64} />
                            <h1 className="text-2xl font-bold">
                                Not much going on here yet.
                            </h1>
                            <Button
                                className=""
                                onClick={() =>
                                    router.push(
                                        `/objectives/${user?.employeeId}`
                                    )
                                }
                                variant="primary"
                            >
                                See my objectives
                                <Icon
                                    icon="tdesign:arrow-right-up"
                                    className="ml-1"
                                    fontSize={16}
                                />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
