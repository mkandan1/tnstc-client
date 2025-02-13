import { Icon } from "@iconify/react/dist/iconify.js";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import React from 'react'
import { twMerge } from "tailwind-merge";

const iconVariants = cva('inline-block', {
    variants: {
        intent: {
            primary: "text-white",
            secondary: "text-indigo-600",
            success: "text-green-500",
            danger: "text-red-500",
            black: "text-blueGray-500"
        },
        animation: {
            none: "",
            spin: "animate-spin",
            bounce: "animate-bounce",
            wiggle: "animate-wiggle"
        }
    },
    defaultVariants: {
        intent: "primary",
        animation: "none"
    }
})

const iconSize = {
    sm: "w-4 h-4",
    md: "w-6 h-4",
    lg: "w-8 h-8",
    responsive: "w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
}

export const InteractiveIncon = ({
    name,
    intent = "primary",
    size = "md",
    animation = "none"
}) => {
    return (
        <Icon
            icon={name}
            className={twMerge(clsx(iconVariants({ intent, animation }, iconSize[size])))}
        />
    )
}
