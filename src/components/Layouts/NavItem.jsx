import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useLocation } from "react-router-dom";

export const NavItem = ({ text, href, icon, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(href);

    return (
        <Link
            to={href}
            className={`${isActive
                ? "text-purple-500 hover:text-purple-600"
                : "text-blueGray-500 hover:text-blueGray-700"
                }`}
            onClick={onClick}
        >
            <li className="flex items-center">
                <Icon
                    icon={icon}
                    className={`mr-3 ${isActive ? "opacity-75" : "text-blueGray-300"
                        }`}
                />
                <span className="text-md font-semibold">{text}</span>
            </li>
        </Link>
    );
};