import { useState } from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

const ButtonList = ({ buttons = [], onClick, goBack = false }) => {
    const [loadingButtons, setLoadingButtons] = useState({});
    const navigate = useNavigate();

    const handleClick = async (id) => {
        // Set loading state for the specific button
        setLoadingButtons((prevState) => ({ ...prevState, [id]: true }));

        try {
            await onClick(id);
            setLoadingButtons((prevState) => ({ ...prevState, [id]: false }));
        } catch (error) {
            console.error('Error during button click:', error);
        } finally {
            setLoadingButtons((prevState) => ({ ...prevState, [id]: false }));
        }
    };

    return (
        <div className="flex space-x-4 w-full">
            {buttons.length > 0 &&
                buttons.map((button) => (
                    <Button
                        key={button.id}
                        label={button.label}
                        startIcon={button.icon}
                        disabled={button.disabled}
                        size="large"
                        intent={button.label == "Delete" ? "destructive" : "primary"}
                        isLoading={loadingButtons[button.id] || false}
                        onClick={() => handleClick(button.id)}
                    />
                ))}
            {goBack &&
                <Button label={'Back'} startIcon={'icon-park-outline:back'} intent="secondary" onClick={() => navigate(-1)} />
            }
        </div>
    );
};

export default ButtonList;