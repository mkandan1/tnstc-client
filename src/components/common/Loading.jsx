import { Icon } from "@iconify/react/dist/iconify.js";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export const Loading = ({ show = true, size = "large", color = "blue" }) => {
  const sizeClasses = {
    small: "text-3xl pt-20",
    medium: "text-4xl pt-40",
    large: "text-5xl pt-72",
  };

  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "transition-all md:ml-72 absolute flex flex-col items-center top-0 left-0 right-0 bottom-0 bg-white bg-opacity-60 backdrop-blur-sm",
          show ? "z-50 opacity-100 pointer-events-auto" : "opacity-0 -z-100 pointer-events-none",
          sizeClasses[size]
        )
      )}
    >
      <Icon
        icon="mingcute:loading-3-fill"
        className={"animate-spin"}
      />

      <div className="mt-4 text-center">
        <p className="text-xl font-medium text-blueGray-700 opacity-0 animate-fade-in">
          Please wait, loading data...
        </p>
        <p className="text-sm text-blueGray-500 opacity-0 animate-fade-in mt-2">
          This might take longer than usual. Thank you for your patience.
        </p>
      </div>
    </div>
  );
};
