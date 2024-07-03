"use client";

import Button from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const { user } = useAuth()
    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")

    const [recoveryId, setRecoveryId] = useQueryState("recoveryId");
    const [onboard, setOnboard] = useQueryState("onboard", parseAsBoolean.withDefault(false));

    const { toast } = useToast();
    const { logout } = useAuth()
    const router = useRouter()

    async function changePassword(e: React.SyntheticEvent) {

        setLoading(true);
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setError("Your new password does not match.")
            setLoading(false)
            return;
        }

        if (newPassword.length < 6) {
            setError("Your new password should have at least 6 characters.")
            setLoading(false)
            return;
        }

        axios
            .put(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-change?onboard=true`, {
                password,
                newPassword,
                recoveryId
            })
            .then((response) => {
                if (response.status === 201) {
                    logout()
                    router.push("/auth")
                    toast({
                        title: "Password changed successfully.",
                        description: "You can now login with your new password.",
                    });
                }
            })
            .catch((err: any) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
                setError(err.response.data)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (onboard && user) {
            toast({
                title: "Welcome to the team!",
                description: "You need to change your password before you can continue.",
            });
            setPassword(user.matricule)
        }
    }, [onboard])

    return (
        <main className="flex flex-1 h-full flex-col items-center justify-center p-16">
            <div className="flex w-[320px] flex-col items-center gap-1 rounded-md border border-zinc-200 bg-white p-8 text-center shadow-sm">
                <h1 className="w-fit text-2xl font-semibold leading-none">
                    Password change
                </h1>
                <h2 className="mt-1 text-sm text-zinc-500">
                    Enter your old password and change it to a new one.
                </h2>
                <form
                    onSubmit={changePassword}
                    className="mt-4 flex w-full flex-col items-center gap-2"
                >
                    {!recoveryId && <div className="flex w-full flex-col items-start">
                        <Label htmlFor="oldpassword" className="">Old password</Label>
                        <Input
                            type="password"
                            required
                            className=""
                            name="oldpassword"
                            placeholder="Enter your old password"
                            value={password}
                            disabled={onboard}
                            onChange={(e: any) => setPassword(e.target.value)}
                        />
                    </div>
                    }
                    <div className="flex w-full flex-col items-start mt-4">
                        <Label>New password</Label>
                        <Input
                            type="password"
                            required
                            className=""
                            name="password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e: any) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full flex-col items-start">
                        <Label>Confirm password</Label>
                        <Input
                            type="password"
                            required
                            className=""
                            name="password"
                            placeholder="Confirm your new password"
                            value={confirmNewPassword}
                            onChange={(e: any) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p className="text-xs text-red-700">{error}</p>
                    )}
                    <div className="flex flex-col items-center justify-start gap-2">
                        <Button
                            disabled={(!password && !recoveryId) || !newPassword || !confirmNewPassword}
                            type="submit"
                            className="mt-4"
                            loading={loading}
                            variant="outline"
                            onClick={changePassword}
                        >
                            Change password
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
