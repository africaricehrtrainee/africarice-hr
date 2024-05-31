"use client";

import Button from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { toast } = useToast();
    const params = useSearchParams();
    const router = useRouter();
    const { setUser } = useAuth();

    async function logIn(e: React.SyntheticEvent) {
        setLoading(true);
        e.preventDefault();
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                email,
                password,
            })
            .then((response) => {
                console.log(response);
                if (response.data.user) {
                    setUser(response.data.user);
                    toast({
                        description: "Successfully logged in.",
                    });
                    if (response.data.user.password == "1234") {
                        router.push(`/auth/password-change?onboard=true`);
                    } else if (response.data.user.subordinates.length > 0) {
                        router.push(`/`);
                    } else if (params.get("redirect")) {
                        console.log("redirect");
                        router.back();
                    } else if (response.data.user.role === "admin") {
                        console.log("admin");
                        router.push(`/management/admin`);
                    } else {
                        console.log("employee");
                        router.push(`/objectives/${response.data.user.employeeId}`);
                    }
                } else {
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    });
                }
            })
            .catch((err: any) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        console.log(error);
    }, [error]);

    return (
        <main className="flex flex-1 h-full flex-col items-center justify-center p-16">
            <div className="flex w-[320px] flex-col items-center gap-1 rounded-md border border-zinc-200 bg-white p-8 text-center shadow-sm">
                <h1 className="w-fit text-2xl font-semibold leading-none">
                    Sign in
                </h1>
                <h2 className="mt-1 text-sm text-zinc-500">
                    Sign into your staff account to get access to our platform.
                </h2>
                <form
                    onSubmit={logIn}
                    className="mt-4 flex w-full flex-col items-center gap-2"
                >
                    <div className="flex w-full flex-col items-start">
                        <Label className="">E-mail</Label>
                        <Input
                            type="email"
                            required
                            className=""
                            name="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full flex-col items-start">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            required
                            className=""
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p className="mt-1 text-sm text-red-400">{error}</p>
                    )}
                    <div className="flex flex-col items-center justify-start gap-2">
                        <Button
                            type="submit"
                            className="mt-4"
                            loading={loading}
                            variant="outline"
                            onClick={logIn}
                        >
                            Login
                            <Icon icon="akar-icons:arrow-right" className="w-4 h-4 ml-1" />
                        </Button>
                        {/* <Button type="button" variant="outline" onClick={
                            async () => {
                                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/saml`, {
                                    method: "GET",
                                    redirect: "follow",
                                }).then((response) => {
                                    console.log(response)
                                }).catch(err => console.log('error from ajax', err))
                            }}>
                            Login as CGIAR
                            <Icon icon="ri:building-line" className="w-4 h-4 ml-1" />
                        </Button> */}
                        <Link href="auth/recovery" className="text-xs text-muted-foreground underline underline-offset-2">Forgot your password ?</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
