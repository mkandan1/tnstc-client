import { PanelContainer } from "../../components/Layouts/Container";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "../../services/user.service"; // Updated service
import PageHeader from "../../components/Layouts/PageHeader";
import NormalTable from "../../components/ui/table/NormalTable";

const Users = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const headers = [
        {
            label: 'Full Name',
            field: 'fullName', // Derived from firstName and lastName
        },
        {
            label: 'Role',
            field: 'role', // Displays user role (Driver, Manager, Admin, etc.)
        },
        {
            label: 'Contact Number',
            field: 'contactNumber',
        },
        {
            label: 'Email',
            field: 'email',
        },
        {
            label: 'Status',
            field: 'isActive', // Boolean field converted to "Active/Inactive"
        },
    ];

    const handleEdit = (row) => {
        console.log("Clicked")
        navigate(`${row._id}`); 
    };

    const buttons = [
        { id: "add-user", label: "Add User", icon: "gridicons:create" },
    ];

    const onButtonClick = async (id) => {
        if (id === 'add-user') {
            navigate('new');
            return true;
        }
    };

    const actions = [
        {
            label: "View",
            icon: "mdi:eye",
            callback: (row) => navigate(row._id),
        },
        {
            label: "Edit",
            icon: "mdi:pencil",
            callback: (row) => handleEdit(row),
        },
    ];

    useEffect(() => {
        let isMounted = true;

        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await userService.getAllUsers(); // Fetch users from API
                if (isMounted) {
                    const formattedData = data.results.map(user => ({
                        ...user,
                        fullName: `${user.firstName} ${user.lastName}`,
                        isActive: user.isActive ? "Active" : "Inactive",
                    }));
                    setUsers(formattedData);
                    console.log(users)
                }
            } catch (err) {
                setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <PanelContainer>
            <PageHeader
                title="Users"
                description={`You have ${users.length} users`}
                buttons={buttons}
                onButtonClick={(id) => onButtonClick(id)}
            />
            <div className="w-screen md:w-auto overflow-x-auto">
                <NormalTable headers={headers} data={users} actions={actions} isLoading={loading} />
            </div>
        </PanelContainer>
    );
};

export default Users;
