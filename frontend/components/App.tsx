"use client";
import { AuthProvider } from "@/hooks/useAuth";
import { LoaderRefProvider } from "@/hooks/useLoading";
import { ReactQueryClientProvider } from "./ReactQueryProvider";
interface IProps {
    children: React.ReactNode;
}

export default function App(props: IProps) {
    return (
        <>
            <AuthProvider>
                    <LoaderRefProvider>
                        {props.children}
                        </LoaderRefProvider>
            </AuthProvider>
        </>
    );
}
