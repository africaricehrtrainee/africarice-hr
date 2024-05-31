import { twMerge } from "tailwind-merge";

interface SelectorProps extends React.HTMLProps<HTMLSelectElement> {}
export function Select(props: SelectorProps) {
    const options = ["admin", "supervisor", "staff"];
    return (
        <select
            {...props}
            className={twMerge(
                "w-full p-2 px-3 mt-1 text-sm outline-none border rounded-md border-zinc-200 transition-all focus:border-brand ",
                props.className
            )}
        ></select>
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
