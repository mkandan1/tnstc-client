import { NavItem } from "./NavItem";

const AdminSidebar = () => {
    return (
        <>
            <p className="text-gray-500 uppercase text-sm font-semibold tracking-tight">Overview</p>
            <ul className="my-5 md:my-6 flex flex-col gap-4 md:gap-7">
                <NavItem text={'Dashboard'} href={'/admin/home'} icon={'ic:round-dashboard'} />
                <NavItem text={'Managers'} href={'/admin/managers'} icon={'icon-park-solid:people'} />
            </ul>

            <p className="text-gray-500 uppercase text-sm font-semibold tracking-tight">Account</p>
            <ul className="my-5 md:my-6 flex flex-col gap-4 md:gap-7">
                <NavItem text={'My Profile'} href={'/manager/account/profile'} icon={'gg:profile'} />
                <NavItem text={'Settings'} href={'/lms/account/settings'} icon={'fluent:settings-24-filled'} />
                <NavItem text={'Log out'} href={'#'} icon={'ri:logout-box-line'} onClick={() => handleLogOut()} />
            </ul>
        </>
    );
}

export default AdminSidebar;