import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { get } from "../../api/api";
import { setUser } from "../../redux/userSlice";
import { Loading } from "../common/Loading";
import { useNavigate } from "react-router-dom";
import { delayedNavigation } from "../../util/navigate";
import toast from "react-hot-toast";

export const CenterContainer = ({ children }) => {
    return (
        <div className="w-screen h-screen px-5 flex flex-col items-center pt-32">
            <div className=" flex flex-col items-center">
                {children}
            </div>
        </div>
    );
}

export const PanelContainer = ({ children }) => {

    return (
        <div className="w-screen relative lg:w-auto pt-20 px-2 md:px-10 md:pt-16 h-screen overflow-y-auto">
            {children}
        </div>
    );
};