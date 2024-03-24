"use client";
import { AuthProvider } from "@/hooks/useAuth";
import { LoaderRefProvider } from "@/hooks/useLoading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
interface IProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient();
export default function App(props: IProps) {
    return (
        <>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <LoaderRefProvider>{props.children}</LoaderRefProvider>
                </QueryClientProvider>
            </AuthProvider>
        </>
    );
}
