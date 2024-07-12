import { twMerge } from "tailwind-merge";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
    valid?: boolean
}
export function Input(props: InputProps) {
    return (
        <input
            {...props}
            className={twMerge(
                "w-full p-2 px-3 mt-1 text-xs outline-none border disabled:bg-zinc-50  rounded-md border-zinc-200 hover:border-zinc-500 transition-all",
                "focus:border-gray-300 focus:outline-gray-100",
                !props.disabled && props.required && !props.value && "border-red-300",
                props.className
            )}
        ></input>
    );
}

export function Label(props: React.HTMLProps<HTMLLabelElement>) {
    return (
        <label
            {...props}
            className={twMerge("text-sm font-medium", props.className)}
        >
            {props.children}
        </label>
    );
}
