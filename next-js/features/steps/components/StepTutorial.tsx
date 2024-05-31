// White component that will have different steps of the tutorial as GIF videos with a description of the step

import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { useState } from "react";

export default function StepTutorial({ onClose }: { onClose: () => void }) {
    return (
        <div className="flex flex-col items-start justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-200 p-1 px-3 text-[10px] font-semibold text-green-700">
                Tutorial
                <Icon icon="bi:star-fill" className="ml-1" fontSize={10} />
            </div>
            <div className="relative h-full w-full rounded-lg bg-zinc-100">
                <Image
                    src="/videos/1.gif"
                    width={1280}
                    height={720}
                    alt="Tutorial"
                    objectFit="cover"
                />
            </div>
            <div className="flex w-full items-start justify-end">
                <Button variant="outline" onClick={() => onClose()}>
                    Close
                    <Icon
                        icon="bi:arrow-right"
                        className="ml-1"
                        fontSize={12}
                    />
                </Button>
            </div>
        </div>
    );
}
