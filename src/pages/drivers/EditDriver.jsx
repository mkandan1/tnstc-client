import { useEffect, useState } from "react";
import { areObjectsEqual } from "../../util/objectCompraion.js";
import PageHeader from "../../components/Layouts/PageHeader.jsx";
import { PanelContainer } from "../../components/Layouts/Container.jsx";
import { Loading } from "../../components/common/Loading.jsx";
import { TabContainer } from "../../components/Layouts/TabContainer.jsx";
import { Tabs, Button, TextInput, Select } from "flowbite-react";
import driverService from "../../services/driver.service.js";
import urlService from "../../services/url.service.js";
import toast from "react-hot-toast";

const EditDriver = () => {
    const [loading, setLoading] = useState(true);
    const [originalDriver, setOriginalDriver] = useState(null);
    const [showDeleteModel, setShowDeleteModel] = useState(false);
    const driverId = urlService.getId();
    const [driver, setDriver] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        address: '',
        dateOfBirth: '',
        licenseNumber: '',
        isActive: true,
        gender: 'Male',
        emergencyContact: {
            name: '',
            contactNumber: ''
        },
        drivingExperience: 0,
        vehicleTypes: [],
        assignedBuses: [],
        profilePicture: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
        ratings: [],
        permissions: [],
        addedToDB: false
    });
    const [buttons, setButtons] = useState([
        {
            id: 'save-driver',
            label: "Save",
            icon: "fa-solid:save",
            disabled: true
        },
        {
            id: 'delete-driver',
            label: "Delete",
            icon: "material-symbols:delete-rounded"
        }
    ]);

    const formattedDate = driver.dateOfBirth
        ? new Date(driver.dateOfBirth).toISOString().split("T")[0]  // Converts to yyyy-mm-dd format
        : '';

    const fetchDriverData = async () => {
        const driverData = await driverService.getDriverById(driverId).catch(err => setLoading(false));
        setDriver(driverData);
        setOriginalDriver(driverData);
        setLoading(false);
    };

    useEffect(() => {
        fetchDriverData();
    }, []);

    useEffect(() => {
        if (driver && originalDriver) {
            const hasChanged = !areObjectsEqual(driver, originalDriver, ['createdAt', 'updatedAt', 'profilePicture']);
            if (hasChanged) {
                setButtons((prev) =>
                    prev.map((button) =>
                        button.id === 'save-driver'
                            ? { ...button, disabled: false }
                            : button
                    )
                );
            }
        }
    }, [driver, originalDriver]);

    const onButtonClick = async (id) => {
        if (id === 'save-driver') {
            await handleDriverEdit();
            return true;
        }
        else {
            setShowDeleteModel(true);
            return;
        }
    };

    const handleDriverEdit = async () => {
        delete driver.createdAt
        delete driver.updatedAt
        const updateResponse = await driverService.updateDriver(driverId, driver)
            .then(() => {
                toast.success('Driver data updated')
            })
    };

    return (
        <PanelContainer>
            <Loading show={loading} />
            <PageHeader
                title={`Drivers > ${driver.firstName} ${driver.lastName}`}
                description={"Fill the below details to create or update driver profile"}
                buttons={buttons}
                onButtonClick={(id) => onButtonClick(id)}
                goBack
            />

            <TabContainer>
                <Tabs variant="underline">
                    <Tabs.Item active title="Basic Information">
                        <div className="space-y-4">
                            <div>
                                <label>First Name</label>
                                <TextInput
                                    type="text"
                                    value={driver.firstName}
                                    onChange={(e) => setDriver({ ...driver, firstName: e.target.value })}
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <TextInput
                                    type="text"
                                    value={driver.lastName}
                                    onChange={(e) => setDriver({ ...driver, lastName: e.target.value })}
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                            <div>
                                <label>Email</label>
                                <TextInput
                                    type="email"
                                    value={driver.email}
                                    onChange={(e) => setDriver({ ...driver, email: e.target.value })}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                            <div>
                                <label>Contact Number</label>
                                <TextInput
                                    type="text"
                                    value={driver.contactNumber}
                                    onChange={(e) => setDriver({ ...driver, contactNumber: e.target.value })}
                                    placeholder="Enter contact number"
                                    required
                                />
                            </div>
                            <div>
                                <label>Date of Birth</label>
                                <TextInput
                                    type="date"
                                    value={formattedDate}
                                    onChange={(e) => setDriver({ ...driver, dateOfBirth: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>License Number</label>
                                <TextInput
                                    type="text"
                                    value={driver.licenseNumber}
                                    onChange={(e) => setDriver({ ...driver, licenseNumber: e.target.value })}
                                    placeholder="Enter license number"
                                    required
                                />
                            </div>
                            <div>
                                <label>Gender</label>
                                <Select
                                    value={driver.gender}
                                    onChange={(e) => setDriver({ ...driver, gender: e.target.value })}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Select>
                            </div>
                        </div>
                    </Tabs.Item>

                    <Tabs.Item title="Emergency Contact">
                        <div className="space-y-4">
                            <div>
                                <label>Name</label>
                                <TextInput
                                    type="text"
                                    value={driver.emergencyContact.name}
                                    onChange={(e) => setDriver({ ...driver, emergencyContact: { ...driver.emergencyContact, name: e.target.value } })}
                                    placeholder="Enter emergency contact name"
                                    required
                                />
                            </div>
                            <div>
                                <label>Contact Number</label>
                                <TextInput
                                    type="text"
                                    value={driver.emergencyContact.contactNumber}
                                    onChange={(e) => setDriver({ ...driver, emergencyContact: { ...driver.emergencyContact, contactNumber: e.target.value } })}
                                    placeholder="Enter emergency contact number"
                                    required
                                />
                            </div>
                        </div>
                    </Tabs.Item>

                    <Tabs.Item title="Ratings">
                        {driver.ratings.map((rating, index) => (
                            <div key={index} className="space-y-2">
                                <p><strong>Rating:</strong> {rating.rating}</p>
                                <p><strong>Comment:</strong> {rating.comments}</p>
                            </div>
                        ))}
                    </Tabs.Item>

                    <Tabs.Item title="Vehicle Types">
                        <div>
                            <label>Vehicle Types</label>
                            <ul>
                                {driver.vehicleTypes.map((type, index) => (
                                    <li key={index}>{type}</li>
                                ))}
                            </ul>
                        </div>
                    </Tabs.Item>
                </Tabs>
            </TabContainer>
        </PanelContainer>
    );
};

export default EditDriver;
