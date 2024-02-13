"use client";
import { AuthProvider } from "@/hooks/useAuth";
import { LoaderRefProvider } from "@/hooks/useLoading";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface IProps {
    children: React.ReactNode;
}
export default function App(props: IProps) {

    return (
        <>
            <AuthProvider>
                <LoaderRefProvider>{props.children}</LoaderRefProvider>
            </AuthProvider>
        </>
    );
}
