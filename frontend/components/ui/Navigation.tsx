"use client";

import Image from "next/image";
import AfricaRice from "@/public/africarice.webp";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "./Button";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import LoadingBar from "react-top-loading-bar";
import { useLoaderRef } from "@/hooks/useLoading";
import axios from "axios";

function Profile() {
    const { user, logout } = useAuth();
    const pathName = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    console.log(user);

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
                            "flex h-9 w-9 items-center justify-center rounded-full outline outline-4 bg-zinc-500 text-xs font-bold text-white transition-all " +
                            `${
                                isOpen
                                    ? "outline-zinc-300"
                                    : "outline-transparent"
                            }`
                        }
                    >
                        {user.firstName && user.lastName
                            ? user.lastName.charAt(0) + user.firstName.charAt(0)
                            : ""}
                    </button>

                    <div
                        ref={divRef}
                        className={
                            "absolute left-0 z-10 flex flex-col justify-start items-start gap-1 top-full mt-4 rounded-md border border-zinc-200 bg-white shadow-sm transition-all p-2 " +
                            `${
                                isOpen
                                    ? "opacity-100 visible translate-y-0"
                                    : "opacity-0 invisible -translate-y-4"
                            }`
                        }
                    >
                        <Link
                            className={
                                "rounded-lg whitespace-nowrap p-2 px-3 text-xs font-bold transition-all hover:text-zinc-800 text-zinc-700 hover:bg-zinc-50  active:scale-90 flex items-center justify-between gap-4 group w-full " +
                                ` ${pathName == "/account" && "text-zinc-800"}`
                            }
                            href="/"
                        >
                            Account settings
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"
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

                    <Button type="submit" variant="outline">
                        My Inbox
                        <Icon
                            icon="heroicons:inbox-16-solid"
                            className="ml-1"
                            fontSize={14}
                        />
                        <div className="absolute -bottom-2 -right-2 h-4 w-4 animate-ping rounded-full bg-red-500"></div>
                    </Button>
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

    if (item.children)
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={
                        "rounded-full p-2 px-4 text-xs font-bold transition-all hover:bg-zinc-100 text-zinc-500 active:scale-90 flex items-center justify-center gap-1 group" +
                        ` ${
                            pathName.includes(item.route as string) &&
                            "bg-zinc-100 text-zinc-800"
                        }`
                    }
                >
                    {item.name}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 48 48"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="4"
                            d="M36 18L24 30L12 18"
                        />
                    </svg>
                </button>

                <div
                    className={
                        "absolute left-0 z-10 flex flex-col justify-start items-start top-full mt-2 rounded-lg border border-zinc-200 bg-white shadow-sm transition-all p-2 gap-2 " +
                        `${
                            isOpen
                                ? "opacity-100 visible translate-y-0"
                                : "opacity-0 invisible -translate-y-4"
                        }`
                    }
                >
                    {item.children.map((child) => {
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    className="transition-all group-hover:translate-x-1"
                                >
                                    <path
                                        fill="currentColor"
                                        d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01L5.99 16.596Z"
                                    />
                                </svg>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    else
        return (
            <Link
                key={item.name}
                className={
                    "rounded-full p-2 px-4 text-xs font-bold transition-all hover:bg-zinc-100 text-zinc-500 active:scale-90 flex items-center justify-center gap-1 group" +
                    ` ${
                        item.route == "/"
                            ? pathName == "/"
                            : pathName.includes(item.route as string) &&
                              "bg-zinc-100 text-zinc-800"
                    }`
                }
                href={item.route as string}
            >
                {item.name}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="transition-all group-hover:translate-x-1"
                >
                    <path
                        fill="currentColor"
                        d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01L5.99 16.596Z"
                    />
                </svg>
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
            route: "/objectives",
            children: [
                {
                    name: "My Objectives",
                    route: `/objectives/${user?.employeeId}`,
                },
                {
                    name: "360 Evaluation",
                    route: `/global/${user?.employeeId}`,
                },
            ],
        },
        {
            name: "Management",
            route: "/management",
            children: [
                {
                    name: "Organogram",
                    route: `/management/organogram`,
                },
                {
                    name: "Accounts",
                    route: "/management/admin",
                    permission: ["admin", "hr"],
                },
            ],
        },
    ];

    return (
        <>
            {user && (
                <div className="flex items-center justify-center gap-2">
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

    axios.defaults.withCredentials = true;

    return (
        <nav className="flex h-14 w-full select-none items-center justify-between gap-8 bg-white px-8 shadow-sm">
            <LoadingBar color="lightgreen" height={5} ref={loaderRef} />

            <Profile />
            <Menu />
            <Link href="/">
                <Image
                    src={AfricaRice}
                    className="h-auto w-24"
                    alt="Africa Rice"
                />
            </Link>
        </nav>
    );
}
