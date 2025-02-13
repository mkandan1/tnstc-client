import { PanelContainer } from "../../components/Layouts/Container";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { driverService } from "../../services"; // Assuming driverService handles API calls
import PageHeader from "../../components/Layouts/PageHeader";
import NormalTable from "../../components/ui/table/NormalTable";

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const headers = [
        {
            label: 'Full Name',
            field: 'fullName', // Derived from firstName and lastName
        },
        {
            label: 'Contact Number',
            field: 'contactNumber',
        },
        {
            label: 'License Number',
            field: 'licenseNumber',
        },
        {
            label: 'Assigned Buses',
            field: 'assignedBuses', // Will display a count or list of buses
        },
        {
            label: 'Status',
            field: 'isActive', // Boolean field converted to "Active/Inactive"
        },
    ];

    const handleEdit = (row) => {
        navigate(row._id); // Navigate to the driver's detail or edit page
    };

    const buttons = [
        { id: "add-driver", label: "Add Driver", icon: "gridicons:create" },
    ];

    const onButtonClick = async (id) => {
        if (id === 'add-driver') {
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

        const fetchDrivers = async () => {
            try {
                setLoading(true);
                const data = await driverService.getAllDrivers(); // Fetch drivers from API
                if (isMounted) {
                    const formattedData = data.map(driver => ({
                        ...driver,
                        fullName: `${driver.firstName} ${driver.lastName}`,
                        assignedBuses: driver.assignedBuses?.length || 0,
                        isActive: driver.isActive ? "Active" : "Inactive",
                    }));
                    setDrivers(formattedData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDrivers();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <PanelContainer>
            <PageHeader
                title="Drivers"
                description={`You have ${drivers.length} drivers`}
                buttons={buttons}
                onButtonClick={(id) => onButtonClick(id)}
            />
            <div className="w-screen md:w-auto overflow-x-auto">
                <NormalTable headers={headers} data={drivers} actions={actions} isLoading={loading} />
            </div>
        </PanelContainer>
    );
};

export default Drivers;
