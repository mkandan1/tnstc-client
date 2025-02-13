import { NavItem } from "./NavItem";

const AdminSidebar = () => {
    return (
        <>
            <p className="text-gray-500 uppercase text-sm font-semibold tracking-tight">Overview</p>
            <ul className="my-5 md:my-6 flex flex-col gap-4 md:gap-7">
                <NavItem text={'Dashboard'} href={'/admin/home'} icon={'ic:round-dashboard'} />
                <NavItem text={'Managers'} href={'/admin/managers'} icon={'icon-park-solid:people'} />
            </ul>
        </>
    );
}

export default AdminSidebar;