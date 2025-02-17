import { NavItem } from "./NavItem";

const ManagerSidebar = () => {
    return (
        <>
            <p className="text-gray-500 uppercase text-sm font-semibold tracking-tight">Overview</p>
            <ul className="my-5 md:my-6 flex flex-col gap-4 md:gap-7">
                <NavItem text={'Dashboard'} href={'/manager/home'} icon={'ic:round-dashboard'} />
                <NavItem text={'Users'} href={'/manager/users'} icon={'bi:people-fill'} />
                <NavItem text={'Buses'} href={'/manager/buses'} icon={'mdi:bus'} />
                <NavItem text={'Stops'} href={'/manager/stops'} icon={'carbon:stop-filled'} />
                <NavItem text={'Routes'} href={'/manager/routes'} icon={'fa-solid:road'} />
                <NavItem text={'Schedules'} href={'/manager/schedules'} icon={'tabler:clock-filled'} />
            </ul>

            <p className="text-gray-500 uppercase text-sm font-semibold tracking-tight">Account</p>
            <ul className="my-5 md:my-6 flex flex-col gap-4 md:gap-7">
                <NavItem text={'My Profile'} href={'/manager/account/profile'} icon={'gg:profile'} />
                <NavItem text={'Settings'} href={'/manager/account/settings'} icon={'fluent:settings-24-filled'} />
                <NavItem text={'Log out'} href={'#'} icon={'ri:logout-box-line'} onClick={() => handleLogOut()} />
            </ul>
        </>
    );
}

export default ManagerSidebar;