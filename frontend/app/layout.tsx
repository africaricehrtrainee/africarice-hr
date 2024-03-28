import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import App from "@/components/App";
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ReactQueryClientProvider } from "@/components/ReactQueryProvider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AfricaRice - HR Portal",
    description: "The Human Resources Management Portal",
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReactQueryClientProvider>
            <html lang="en">
                <body
                    className={
                        GeistSans.className +
                        " bg-background flex flex-col min-h-screen"
                    }
                >
                    <App>
                        <Navigation />
                        {children}
                    </App>
                    <div id="modal-root"></div>
                    <Toaster />
                </body>
            </html>
        </ReactQueryClientProvider>
    );
}
