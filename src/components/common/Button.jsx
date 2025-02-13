import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const IconButton = ({
    id,
    text,
    disabled = false,
    loading = false,
    icon,
    onClick,
    bg = "purple-600",
}) => {
    // Function to compute color state
    const getState = (bg, shade) => {
        const [color, currentShade] = bg.split("-");
        return `${color}-${shade}`;
    };

    const disabledState = getState(bg, "300");

    return (
        <button
            id={id}
            className={`focus:outline-none h-10 w-auto px-6 transition-all duration-200 font-medium rounded-lg shadow-md flex items-center justify-center gap-x-2
                ${loading
                    ? `bg-white text-${bg.split("-")[0]}-600 cursor-not-allowed` // White bg with text color matching the base color
                    : disabled
                        ? `bg-${disabledState} cursor-not-allowed text-white`
                        : `bg-${bg} text-white hover:bg-${bg.replace("-600", "-700")} active:shadow-lg transform active:scale-95`
                } focus:ring-4 focus:ring-${bg.replace("-600", "-300")} dark:bg-${bg} dark:hover:bg-${bg.replace("-600", "-700")} dark:focus:ring-${bg.replace("-600", "-900")}`}
            onClick={!loading && !disabled ? onClick : null}
            disabled={loading || disabled}
        >
            {loading? (
                <>
                    <Icon icon="eos-icons:loading" className="animate-spin" />
                    <span className="text-sm font-semibold">Please wait...</span>
                </>
            ) : (
                <>
                    <Icon icon={icon} />
                    <span className="text-sm font-semibold">{text}</span>
                </>
            )}
        </button>
    );
};

export const ButtonList = ({ buttons = [], onClick }) => {
    const [loadingButtons, setLoadingButtons] = useState({});

    const handleClick = async (id) => {
        // Set loading state for the specific button
        setLoadingButtons((prevState) => ({ ...prevState, [id]: true }));

        try {
            // Perform the async operation
            await onClick(id);
        } catch (error) {
            console.error('Error during button click:', error);
        } finally {
            setLoadingButtons((prevState) => ({ ...prevState, [id]: false }));
        }
    };

    return (
        <div className="space-y-4">
            {buttons.length > 0 &&
                buttons.map((button) => (
                    <IconButton
                        key={button.id}
                        text={button.text}
                        icon={button.icon}
                        bg={button?.bg}
                        loading={loadingButtons[button.id] || false}
                        onClick={() => handleClick(button.id)}
                    />
                ))}
        </div>
    );
};

export const GoBackButton = () => {
    const navigate = useNavigate();

    return (
        <button
            className={`focus:outline-none h-10 w-auto px-6 transition-all duration-200 font-medium rounded-lg shadow flex items-center justify-center gap-x-2 
                bg-white text-purple-600 hover:bg-purple-100 hover:shadow active:bg-purple-200 active:shadow-md transform active:scale-95 
                focus:ring-4 focus:ring-purple-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-purple-900`}
            onClick={() => navigate(-1)}
        >
            <Icon icon="icon-park-outline:back" />
            <span className="text-sm font-semibold">Go Back</span>
        </button>
    );
};
