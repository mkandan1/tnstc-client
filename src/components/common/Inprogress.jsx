import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

export const Inprogress = () => {
    return(
        <div className="w-full h-52 flex flex-col justify-end items-center text-blueGray-400">
            <p className="flex gap-x-2 items-center animate-pulse"> <Icon icon={'ph:warning-fill'}/> This page under development. Check back later!</p>

            <div className="mt-3">
                <p>Having trouble? <Link to={'mailto:bhuvaneshwaran.it21@mamcet.com'} className="text-blue-500">Contact us</Link></p>
            </div>
        </div>
    );
}