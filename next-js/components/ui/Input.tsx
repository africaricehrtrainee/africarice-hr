import { twMerge } from "tailwind-merge";

interface InputProps extends React.HTMLProps<HTMLInputElement> { }
export function Input(props: InputProps) {
    return (
        <input
            {...props}
            className={twMerge(
                "w-full p-2 px-3 mt-1 text-sm outline-none border disabled:bg-zinc-100  rounded-md border-zinc-200 hover:border-zinc-500 transition-all focus:border-brand focus:outline-brand-light ",
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
