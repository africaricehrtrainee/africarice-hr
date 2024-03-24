"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/util/utils";
import { useAuth } from "@/hooks/useAuth";
import Modal from "@/components/ui/Modal";
import EditStep from "@/features/steps/components/EditStep";
import {
    selectActiveStep,
    useObjectivesDataStore,
} from "../../../app/objectives/[userId]/_store/useStore";
import { useQueryState } from "nuqs";

export function Step({
    step,
    postSteps,
    index,
}: {
    step: Step;
    postSteps: (number: number) => any;
    index: number;
}) {
    const data = useObjectivesDataStore();
    const activeStep = useObjectivesDataStore(selectActiveStep);
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isEditingMessage, setIsEditingMessage] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const [ostep, setStep] = useQueryState<number>("step", {
        defaultValue: 0,
        parse: (value) => parseInt(value),
    });
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
    }, [divRef]);

    return (
        <>
            {user && (
                <div className="relative flex items-center justify-center gap-4">
                    <Modal
                        show={isEditingMessage}
                        onClose={() => setIsEditingMessage(false)}
                    >
                        <EditStep
                            step={step}
                            onFormSubmit={(success) => {
                                if (success) {
                                    setIsEditingMessage(false);
                                } else {
                                }
                            }}
                        />
                    </Modal>

                    <button
                        onClick={(e) => {
                            if (activeStep >= index) {
                                setStep(index);
                            }
                        }}
                        className={cn(
                            "p-2 px-4 border-transparent rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all active:scale-95 bg-transparent border-zinc-200 text-zinc-500 hover:bg-zinc-50 ",
                            `${activeStep < index && "opacity-50"}`,
                            `${
                                ostep == index &&
                                "bg-white text-zinc-800 border-green-300 shadow-sm"
                            }`
                        )}
                    >
                        {step.name}
                        <p className="-mt-0 text-[8px]">
                            from{" "}
                            {step.dateFrom.substring(8, 10) +
                                "/" +
                                step.dateFrom.substring(5, 7)}{" "}
                            to{" "}
                            {step.dateTo.substring(8, 10) +
                                "/" +
                                step.dateTo.substring(5, 7)}
                        </p>
                    </button>

                    <div
                        ref={divRef}
                        className={
                            "absolute left-0 flex flex-col justify-start items-start min-w-full top-full mt-2 rounded-sm border border-zinc-200 bg-white shadow-sm transition-all z-10 " +
                            `${
                                isOpen
                                    ? "opacity-100 visible translate-y-0"
                                    : "opacity-0 invisible -translate-y-4"
                            }`
                        }
                    >
                        <button
                            onClick={() => {
                                setIsEditingMessage(true);
                            }}
                            className={
                                "rounded-lg whitespace-nowrap p-2 px-3 text-xs font-bold transition-all hover:text-zinc-800 text-zinc-800 hover:bg-zinc-50 active:scale-90 flex items-center justify-between gap-4 group w-full "
                            }
                        >
                            Edit evaluation step
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 1024 1024"
                            >
                                <path
                                    fill="currentColor"
                                    d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32m-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
