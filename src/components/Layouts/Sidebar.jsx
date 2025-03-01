import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar } from "../../redux/sidebarSlice";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../api/api";
import toast from "react-hot-toast";
import { delayedNavigation } from "../../util/navigate";
import ManagerSidebar from "./ManagerSidebar";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import DriverSidebar from "./DriverSidebar";

export const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isOpen = useSelector(state => state.sidebar.isOpen);
    const { user } = useSelector((state) => state.user);
    
    // Loading state for determining user role
    const [loading, setLoading] = useState(true);

    // Handle user role determination (loading state)
    useEffect(() => {
        if (user?.role) {
            setLoading(false); // Stop loading when role is available
        }
    }, [user]);

    const handleLogOut = async () => {
        try {
            const logoutPromise = post('/auth/logout');

            await toast.promise(
                logoutPromise,
                {
                    loading: "You're logging out...",
                    success: "You have been logged out! Redirecting...",
                    error: "Something went wrong! Please try again.",
                },
                {
                    success: { duration: 3000 },
                }
            );

            let serverResponse = await logoutPromise;
            if (serverResponse) {
                delayedNavigation('/login', 3000);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className={`bg-blueGray-900 text md:w-72 md:bottom-0 md:m-0  pb-5 z-20 m-3 shadow-md rounded-md md:rounded-none ${isOpen ? 'block' : 'hidden md:block'} absolute top-0 right-0 left-0`}>
            <div className="px-7">
                <div className="py-4 flex justify-between items-center md:mt-3">
                    <h2 className="uppercase font-bold text-white text-[15px]">TNSTC Ltd</h2>
                    <button className="bg-blueGray-800 md:hidden border border-blueGray-700 px-3 rounded-sm py-4" onClick={() => dispatch(closeSidebar())}>
                        <Icon icon={'vaadin:close'} className="text-gray-300" />
                    </button>
                </div>
                <div className="h-[0.10px] md:hidden w-full bg-blueGray-700"></div>
                
                {/* Show loading indicator while determining user role */}
                <div className="my-5 md:my-8">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <Icon icon="eos-icons:loading" className="animate-spin text-white" width={24} height={24} />
                        </div>
                    ) : (
                        <>
                            {user?.role === 'admin' && <AdminSidebar handleLogOut={handleLogOut} />}
                            {user?.role === 'manager' && <ManagerSidebar handleLogOut={handleLogOut} />}
                            {user?.role === 'driver' && <DriverSidebar handleLogOut={handleLogOut} />}
                        </>
                    )}
                </div>

                <div className="mt-20">
                    <p className="text-[12.5px] text-blueGray-400">&copy; 2025 MAM College of Engineering & Technology, Developed with ❤️ by HypeSquad.</p>
                    <Link to={'https://www.mamcet.com?ref=bus_tracking_web'} target="_blank" className="text-[12px] text-lightBlue-950">www.mamcet.com</Link>
                </div>
            </div>
        </div>
    );
}
