"use client";
import { cn } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
    `p-2 px-4 flex justify-center border border-transparent disabled:bg-zinc-100 disabled:shadow-none disabled:text-zinc-400 disabled:border-transparent items-center text-xs font-semibold gap-1 transition-all shadow-sm active:scale-95 disabled:select-none`,
    {
        variants: {
            border: {
                rounded: "rounded-full",
                default: "rounded-md",
            },
            variant: {
                outline: " border-zinc-300 hover:bg-zinc-50",
                primary: "bg-green-500 text-zinc-50 hover:bg-green-600",
                primaryOutline:
                    "border-green-500 text-green-500 hover:text-green-300 hover:border-green-300",
                secondary:
                    "bg-green-100 shadow-none text-green-600 hover:bg-green-50 border-green-100",
                alert: "bg-red-500 text-red-50 hover:bg-red-100 hover:text-red-700",
                alertOutline:
                    "border-red-500 text-red-500 hover:border-red-400 hover:text-red-400",
                alternate: "bg-purple-600 text-purple-50 hover:bg-purple-700",
                alternateOutline:
                    "border-purple-300 text-purple-500 hover:border-purple-500",
                underline:
                    "bg-transparent text-zinc-800 border-b-2 border-b-zinc-800 p-0 pb-0 rounded-none shadow-none hover:text-zinc-500 hover:border-b-zinc-500",
            },
        },
        defaultVariants: {
            variant: "primary",
            border: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    loading?: boolean;
}

export default function Button(props: ButtonProps) {
    const { variant, border } = props;
    return (
        <button
            {...props}
            disabled={props.loading || props.disabled}
            className={cn(buttonVariants({ variant, border }), props.className)}
        >
            {props.loading ? (
                <>
                    Loading
                    <Icon
                        icon="line-md:loading-loop"
                        className="ml-1"
                        fontSize={16}
                    />
                </>
            ) : (
                <>{props.children} </>
            )}
        </button>
    );
}
