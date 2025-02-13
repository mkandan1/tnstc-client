import { useState } from "react";
import { TextInput } from "../common/Fields";
import { Button } from "../ui/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { validateEmail, validatePassword } from "../../services/InputValidation";
import toast from "react-hot-toast";
import axios from "axios";
import ButtonList from "../ui/button/ButtonList";

export const LoginForm = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ state: false, message: "" });
    const navigate = useNavigate();
    
    const buttons = [
        { id: "login", label: "Login", icon: "ic:round-login" },
    ];

    const handleEmail = (value) => setEmail(value);
    const handlePassword = (value) => setPassword(value);

    const handleUserLogin = async () => {
        setIsLoading(true);

        if (!email || !password) {
            setError({ state: true, message: "Enter all required fields." });
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email) || !validatePassword(password)) {
            setError({ state: true, message: "Invalid email or password format." });
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/auth/login`, { email, password });
            if (response.data.success) {
                toast.success('Logged in successfully');
                window.location.href = '/lms/dashboard';
            } else {
                setError({ state: true, message: "Wrong email or password." });
            }
        } catch (error) {
            setError({ state: true, message: error.response?.status === 401 ? "Wrong email or password." : "An unexpected error occurred." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {error.state && <AlertContainer message={error.message} />}

            <div className="space-y-4">
                <TextInput
                    id="email"
                    label="Email"
                    spellCheck={false}
                    type="email"
                    placeholder="Enter your email address"
                    onChange={handleEmail}
                />
                <TextInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={handlePassword}
                />
            </div>

            <div className="my-6 flex flex-col gap-y-5 items-center">
                <ButtonList buttons={buttons} onClick={(id)=> handleUserLogin()}/>
                {/* <Button label={"Login"} isLoading={isLoading} size="large" onClick={handleUserLogin} /> */}
                <Link to="/forgot-password" className="text-blue-500 text-sm flex items-center gap-x-2">
                    <Icon icon="carbon:password" />
                    Forgot password?
                </Link>
            </div>
        </div>
    );
};


export const ForgotPwd = () => {
    const [email, setEmail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ state: false, message: "" });

    const handleForgotPwd = () => {
        setIsLoading(true);

        if (!email) {
            setError({ state: true, message: "Enter your email address." });
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError({ state: true, message: "Invalid email format." });
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            toast.success('Reset email has been sent');
            setError({ state: false, message: "" });
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {error.state && <AlertContainer message={error.message} />}

            <div className="space-y-4">
                <TextInput
                    id="email"
                    label="Email"
                    spellCheck={false}
                    type="email"
                    placeholder="Enter your email address"
                    onChange={(val) => setEmail(val)}
                />
            </div>

            <div className="mt-6">
                <Button label="Send" isLoading={isLoading} size="large" onClick={handleForgotPwd} />
            </div>
        </div>
    );
};


const AlertContainer = ({ message }) => {
    return (
        <div className="bg-red-100 mt-5 w-[100%] border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{message}</p>
        </div>
    );
};
