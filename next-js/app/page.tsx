"use client";

import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import SuperviseeList from "@/features/employees/components/SuperviseeList";
import { useGetSubordinates } from "@/features/employees/queries/getSubordinates";

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { data } = useGetSubordinates(user?.employeeId);

    return (
        <main className="flex h-full w-full flex-1 items-center justify-center gap-4 p-8">
            {data && (
                <>
                    {data.length > 0 ? (
                        <SuperviseeList employees={data} />
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
