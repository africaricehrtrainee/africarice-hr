import { twMerge } from "tailwind-merge"

interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
    valid?: boolean
}
export function TextArea(props: TextAreaProps) {
    return <textarea {...props}
        className={twMerge(
            "h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-start text-xs disabled:bg-zinc-50 outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500",
            props.required && !props.value && "border-red-300",
            props.className
        )}
    />
}