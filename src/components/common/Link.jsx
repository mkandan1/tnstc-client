import { Link } from "react-router-dom";

export const FooterLink = ({to, text}) => {
    return(
        <Link to={to} className="text-blue-500 text-sm">{text}</Link>
    );
}
