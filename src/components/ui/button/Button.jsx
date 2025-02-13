import { cva } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { InteractiveIncon } from "../icon/Icon";

const button = cva(
    "flex focus:outline-none px-6 transition-all duration-200 font-semibold tracking-tight rounded-md shadow-md items-center justify-center gap-x-2 transform active:scale-95 active:shadow-lg", {
    variants: {
        intent: {
            primary: "bg-indigo-600 text-white hover:bg-indigo-700",
            secondary: "bg-white text-indigo-600 hover:bg-indigo-50",
            destructive: "bg-red-600 text-white hover:bg-red-700",
            info: "bg-yellow-600 text-white hover:bg-red-700"
        },
        size: {
            small: "text-[13px] py-2 px-3",
            default: "text-sm py-2 px-4",
            large: "text-sm py-2 px-6 w-full",
        },
        disabled: {
            true: "cursor-not-allowed bg-indigo-400 hover:bg-indigo-400",
            false: ""
        }
    },
    defaultVariants: {
        intent: "primary",
        size: "default",
        disabled: false,
    }
});

export const Button = ({
    intent = "primary",
    size = "default",
    label,
    disabled = false,
    startIcon,
    className,
    endIcon,
    isLoading = false,
    ...rest }) => {
    return (
        <div className="w-full">
            <button
                disabled={disabled}
                className={twMerge(clsx(button({ intent, size, disabled, className })))}
                {...rest}
            >
                {startIcon && !isLoading ? <InteractiveIncon name={startIcon} intent={intent == "secondary" ? "secondary" : "primary"} size="responsive" /> : null}
                {isLoading ? <InteractiveIncon name={"gg:spinner"} intent={intent == "secondary" ? "secondary" : "primary"} size={"responsive"} animation='spin' /> : null}
                <span className="truncate">{label}</span>
                {endIcon && !isLoading ? <InteractiveIncon name={endIcon} intent="primary" size="responsive" /> : null}
            </button>
        </div>
    )
}