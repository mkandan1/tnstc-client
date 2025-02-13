import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const LoadingIcon = ({ id, icon, loadingIcon = "line-md:loading-twotone-loop", onClick }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) return; // Prevent multiple triggers
        setLoading(true);

        try {
            // Trigger the callback
            await onClick(id);
        } catch (error) {
            console.error("Error in icon action:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="cursor-pointer flex items-center justify-center"
            onClick={handleClick}
        >
            <Icon
                icon={loading ? loadingIcon : icon}
                className={`text-lg ${loading ? "animate-spin" : ""}`}
            />
        </div>
    );
};

export default LoadingIcon;
