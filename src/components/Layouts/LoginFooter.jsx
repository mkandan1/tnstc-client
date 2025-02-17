import { FooterLink } from "../common/Link";


export const Footer = () => {
    return(
        <div className="py-2 absolute bottom-5 md:bottom-10">
            <div className="flex justify-center w-full gap-x-8 py-6">
                <FooterLink to={'/'} text="Terms & Condition"></FooterLink>
                <FooterLink to={'/'} text="Privacy"></FooterLink>
                <FooterLink to={'/'} text="Help"></FooterLink>
            </div>
            <div>
                <p className="text-sm text-gray-500">&copy; 2025 HypeSquad - MAM College of Engineering and Technology, Siruganur</p>
            </div>
        </div>
    );
}