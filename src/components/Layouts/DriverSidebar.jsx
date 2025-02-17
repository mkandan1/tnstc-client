import { NavItem } from "./NavItem";

const DriverSidebar = ({ handleLogOut }) => {
    return (
        <>
            <p className="text-gray-500 uppercase text-sm font-semibold tracking-tight">Overview</p>
            <ul className="my-5 md:my-6 flex flex-col gap-4 md:gap-7">
                <NavItem text={'Dashboard'} href={'/driver/home'} icon={'ic:round-dashboard'} />
            </ul>

            <p className="text-gray-500 uppercase text-sm font-semibold tracking-tight">Account</p>
            <ul className="my-5 md:my-6 flex flex-col gap-4 md:gap-7">
                <NavItem text={'My Profile'} href={'/driver/account/profile'} icon={'gg:profile'} />
                <NavItem text={'Settings'} href={'/driver/account/settings'} icon={'fluent:settings-24-filled'} />
                <NavItem text={'Log out'} href={'#'} icon={'ri:logout-box-line'} onClick={() => handleLogOut()} />
            </ul>
        </>
    );
}

export default DriverSidebar;