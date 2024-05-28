"use client";

import Button from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError>();
    const [email, setEmail] = useState<string>("");
    const { toast } = useToast();

    async function reset(e: React.SyntheticEvent) {
        setLoading(true);
        e.preventDefault();
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/recovery`, {
                email,
            })
            .then((response) => {
                setError(undefined)
                if (response) {
                    toast({
                        description: "Recovery link sent to your mailbox.",
                    });

                }
            })
            .catch((err: any) => {
                setError(err)
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: err.response.data,
                });
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
                    Account recovery
                </h1>
                <h2 className="mt-1 text-sm text-zinc-500">
                    Enter your e-mail address to receive a recovery link for your account
                </h2>
                <form
                    onSubmit={reset}
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
                    {error && error.response && (
                        <p className="text-xs text-red-700">{error.response.data as string}</p>
                    )}
                    <div className="flex flex-col items-center justify-start gap-2">
                        <Button
                            type="submit"
                            className="mt-4"
                            loading={loading}
                            variant="outline"
                            onClick={reset}
                        >
                            Reset my password
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
                    </div>
                </form>
            </div>
        </main>
    );
}
