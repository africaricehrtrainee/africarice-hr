"use client";
import { cn } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { VariantProps, cva } from "class-variance-authority";

const chipVariants = cva(
    ` p-2 px-4 rounded-full flex items-center justify-center gap-0 text-[10px] tracking-normal font-semibold whitespace-nowrap`,
    {
        variants: {
            variant: {
                primary: "bg-zinc-200 text-zinc-500",
                background: "bg-zinc-50 text-zinc-400",
                brand: "bg-brand-light text-brand",
                alternate: "bg-purple-100 text-purple-400",
                blue: "bg-blue-100 text-blue-400",
                destructive: "bg-red-200 text-red-600",
                alert: "bg-yellow-200 text-yellow-600",
            },
            size: {
                xs: "p-2",
            },
        },

        defaultVariants: {
            variant: "primary",
        },
    }
);

interface chipProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof chipVariants> {
    loading?: boolean;
}

export default function Chip(props: chipProps) {
    const { variant } = props;
    return (
        <div
            {...props}
            className={cn(chipVariants({ variant }), props.className)}
        >
            {props.children}
        </div>
    );
}
