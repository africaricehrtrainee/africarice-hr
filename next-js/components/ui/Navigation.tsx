"use client";

import Image from "next/image";
import AfricaRice from "@/public/africarice.webp";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import LoadingBar from "react-top-loading-bar";
import { useLoaderRef } from "@/hooks/useLoading";
import axios from "axios";
import Notification from "./Notification";
import { useObjectivesDataStore } from "@/app/objectives/[userId]/_store/useStore";
import { useEvaluationDataStore } from "@/app/evaluation360/[userId]/_store/useStore";
import { cn } from "@/util/utils";
import { HelpCircle } from "lucide-react";
import { HelpSection } from "@/features/help/components/HelpSection";
import Button from "./Button";

function NotificationBox({ user }: { user: Employee }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [status, setStatus] = useState<Status>();
    const divRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const { objectives, evaluation } = useObjectivesDataStore();
    const { evaluators } = useEvaluationDataStore();

    function computeUndo(status: Status) {
        if (
            status.evaluation360Status === "EVALUATION360_INVALID" ||
            status.evaluation360Status === "EVALUATION360_EMPTY"
        ) {
            return true;
        }

        if (
            status.objectiveStatus === "OBJECTIVE_EMPTY" ||
            status.objectiveStatus === "OBJECTIVE_INVALID" ||
            status.objectiveStatus === "OBJECTIVE_UNRATED" ||
            status.objectiveStatus === "OBJECTIVE_UNREVIEWED"
        ) {
            return true;
        }

        if (
            status.otherEvaluation360Status.length > 0 &&
            status.otherEvaluation360Status.some(
                (obj) => obj.evaluationStatus === "EVALUATION360_UNRATED"
            )
        ) {
            return true;
        }

        if (status.selfEvaluationStatus === "SELF_EVALUATION_EMPTY") {
            return true;
        }

        if (status.supervisorStatus) {
            if (
                status.supervisorStatus.some(
                    (obj) =>
                        obj.evaluationStatus === "SUPERVISOR_EVALUATION_UNRATED"
                )
            ) {
                return true;
            }

            if (
                status.supervisorStatus.some(
                    (obj) =>
                        obj.objectiveStatus ===
                        "SUPERVISOR_OBJECTIVE_UNRATED" ||
                        obj.objectiveStatus ===
                        "SUPERVISOR_OBJECTIVE_UNREVIEWED" ||
                        obj.objectiveStatus ===
                        "SUPERVISOR_OBJECTIVE_UNVALIDATED"
                )
            ) {
                return true;
            }

            if (
                status.supervisorStatus.some(
                    (obj) =>
                        obj.evaluation360Status ===
                        "SUPERVISOR_EVALUATION360_UNREVIEWED"
                )
            ) {
                return true;
            }
        }
        return false;
    }
    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [divRef]);

    useMemo(() => {
        getStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectives, evaluation, evaluators]);
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
                    console.log("status", response.data);
                    setStatus(response.data);
                } else {
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className="relative">
            <div className={
                cn("p-[1px] rounded-md")
            }>
                <Button
                    onClick={() => setIsOpen((prev) => !prev)}
                    type="submit"
                    variant={"outline"}
                    className="bg-white"
                >
                    My Tasks
                    <Icon icon="lets-icons:bell-fill"
                        className={cn("ml-1",
                            status && computeUndo(status) && "text-red-500 animate-shake"
                        )}
                        fontSize={14}
                    />
                </Button>


            </div>
            <div
                ref={divRef}
                className={
                    "absolute left-0 z-10 flex flex-col justify-start items-start gap-1 top-full mt-2 rounded-md border border-zinc-200 bg-white shadow-sm transition-all  " +
                    `${isOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-4"
                    }`
                }
            >
                {status && <Notification user={user} status={status} />}
            </div>
        </div>
    );
}

function Profile() {
    const { user, logout } = useAuth();
    const pathName = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [divRef]);

    return (
        <>
            {user && (
                <div className="relative flex items-center justify-center gap-4">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className={
                            "flex h-9 border items-center gap-2 px-4 justify-center rounded-full  bg-green-100 p-2 text-xs font-bold text-green-800 transition-all " +
                            `${isOpen
                                ? "border-green-800"
                                : "border-transparent"
                            }`
                        }
                    >
                        <Icon icon="ci:hamburger-lg" fontSize={14} />
                        {user.firstName && user.lastName
                            ? `${user.lastName.split(" ")[0]} ${user.firstName.split(" ")[0]
                            }`
                            : ""}
                        <p className="font-mono">{user.matricule}</p>
                    </button>

                    <div
                        ref={divRef}
                        className={
                            "absolute left-0 z-10 flex flex-col justify-start items-start gap-1 top-full mt-4 rounded-md border border-zinc-200 bg-white shadow-sm transition-all p-1 " +
                            `${isOpen
                                ? "opacity-100 visible translate-y-0"
                                : "opacity-0 invisible -translate-y-4"
                            }`
                        }
                    >
                        <Link href="/auth/password-change" className={
                            "rounded-lg whitespace-nowrap p-2 px-3 text-xs font-bold transition-all hover:text-zinc-800 text-zinc-700 hover:bg-zinc-50 active:scale-90 flex items-center justify-between gap-4 group w-full "
                        }>Change password
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01L5.99 16.596Z"
                                />
                            </svg>
                        </Link>
                        <button
                            onClick={() => {
                                logout();
                                router.push("/auth");
                            }}
                            className={
                                "rounded-lg whitespace-nowrap p-2 px-3 text-xs font-bold transition-all hover:text-zinc-800 text-zinc-700 hover:bg-zinc-50 active:scale-90 flex items-center justify-between gap-4 group w-full " +
                                ` ${pathName == "/auth" && "text-zinc-800"}`
                            }
                        >
                            Log out
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01L5.99 16.596Z"
                                />
                            </svg>
                        </button>
                    </div>

                    <NotificationBox user={user} />
                </div>
            )}
        </>
    );
}
interface MenuItem {
    name: string;
    route?: string;
    children?: Omit<MenuItem, "children">[];
    permission?: string[];
}

function Page({ item }: { item: MenuItem }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const pathName = usePathname();
    const { user } = useAuth();

    const handleClickOutside = (event: MouseEvent) => {
        setIsOpen(false);
    };

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!item.permission && user?.email.includes("admin")) return null;
    if (item.children)
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={
                        "rounded-md p-2 px-4 text-xs font-bold transition-all hover:bg-zinc-100 text-zinc-500 hover:text-zinc-600 active:scale-90 flex items-center justify-center gap-1 group" +
                        ` ${item.children.some(
                            (obj) =>
                                pathName.includes(obj.route as string) ||
                                pathName.includes(
                                    (obj.route as string).split("/")[1]
                                )
                        ) && "bg-white shadow-sm text-zinc-800"
                        }`
                    }
                >
                    {item.name}
                </button>

                <div
                    className={
                        "absolute left-0 z-10 flex flex-col justify-start items-start top-full mt-2 rounded-lg border border-zinc-200 bg-white shadow-sm transition-all p-2 gap-2 " +
                        `${isOpen
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-4"
                        }`
                    }
                >
                    {item.children.map((child) => {
                        if (
                            user &&
                            child.permission &&
                            !child.permission.includes(user.role)
                        )
                            return;
                        return (
                            <Link
                                key={child.name}
                                className={
                                    "group flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-lg p-2 px-3 text-xs font-bold text-zinc-800 transition-all hover:bg-zinc-100 hover:text-zinc-800 active:scale-90" +
                                    ` ${pathName == "/auth" && "text-zinc-800"}`
                                }
                                href={child.route as string}
                                replace={true}
                            >
                                {child.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    else if (item.permission && user && !item.permission.includes(user.role))
        return null;
    else
        return (
            <Link
                key={item.name}
                className={
                    "rounded-md p-2 px-4 text-xs font-bold transition-all hover:bg-zinc-200 text-zinc-500 hover:text-zinc-600 active:scale-90 flex items-center justify-center gap-1 group" +
                    ` ${(item.route == "/"
                        ? pathName == "/"
                        : pathName.includes(item.route as string)) &&
                    "bg-white shadow-sm text-zinc-800 hover:bg-zinc-50"
                    }`
                }
                href={item.route as string}
            >
                {item.name}
            </Link>
        );
}

function Menu() {
    const { user, logout } = useAuth();
    const pathName = usePathname();

    const links: MenuItem[] = [
        {
            name: "Home",
            route: "/",
        },
        {
            name: "Performance",
            children: [
                {
                    name: "My Objectives",
                    route: `/objectives/${user?.employeeId}`,
                },
                {
                    name: "My 360 Evaluation",
                    route: `/evaluation360/${user?.employeeId}`,
                },
                {
                    name: "Reporting",
                    route: "/management/reporting",
                    permission: ["admin"],
                },

            ]
        },
        // { name: "Organogram",
        //     route: `/management/organogram`,
        // },
        {
            name: "Accounts",
            route: "/management/admin",
            permission: ["admin"],
        },
        {
            name: "Settings",
            route: "/management/settings/evaluation",
            permission: ["admin"],
        },
    ];

    return (
        <>
            {user && (
                <div className="flex items-center justify-center gap-2 p-1 rounded-md bg-zinc-100">
                    {links.map((link) => {
                        return <Page item={link} key={link.name} />;
                    })}
                </div>
            )}
        </>
    );
}


export default function Navigation() {
    const loaderRef = useLoaderRef();
    const router = useRouter();
    const { user, setUser } = useAuth();
    const pathName = usePathname();

    axios.interceptors.request.use(
        function (config) {
            // Do something before request is sent
            loaderRef.current.continuousStart();
            return config;
        },
        function (error) {
            // Do something with request error
            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    axios.interceptors.response.use(
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            loaderRef.current.complete();
            return response;
        },
        function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            loaderRef.current.complete();
            return Promise.reject(error);
        }
    );

    // Add a redirect to /autth when a 401 occurs
    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            if (error.response.status === 401 && !pathName.includes("auth")) {
                console.log("Path", pathName);
                setUser(null);
                router.push("/auth?redirect=true");
            }
            return Promise.reject(error);
        }
    );

    // A redirect whenever a connected user changes routes while having the default password
    useEffect(() => {
        if (user && user.password === "1234" && !pathName.includes("password-change")) {
            router.push("/auth/password-change?onboard=true");
        }
    }, [pathName]);

    axios.defaults.withCredentials = true;

    return (
        <nav className="flex items-center justify-between w-full gap-8 px-8 bg-white shadow-sm select-none h-14">
            <LoadingBar color="lightgreen" height={5} ref={loaderRef} />

            <Profile />
            <Menu />
            <div className="flex items-center justify-center gap-4">
                {user && <HelpSection />}
                <Link href="/">
                    <Image
                        src={AfricaRice}
                        className="w-24 h-auto"
                        alt="Africa Rice"
                    />
                </Link>
            </div>
        </nav>
    );
}
