import React, { createContext, useContext, useRef, RefObject } from "react";

// Define the type for your loader component's ref
type LoaderRef = RefObject<any>;

// Create a context for the loader ref
const LoaderRefContext = createContext<LoaderRef | null>(null);

// Custom hook to access the loader ref from any component
export function useLoaderRef() {
    const loaderRef = useContext(LoaderRefContext);
    if (!loaderRef) {
        throw new Error("useLoaderRef must be used within a LoaderRefProvider");
    }
    return loaderRef;
}

// Provider component to wrap your app
export function LoaderRefProvider({ children }: { children: React.ReactNode }) {
    const loaderRef = useRef<any>(null);

    return (
        <LoaderRefContext.Provider value={loaderRef}>
            {children}
        </LoaderRefContext.Provider>
    );
}
