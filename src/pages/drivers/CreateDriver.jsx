import { useState } from "react";
import { PanelContainer } from "../../components/Layouts/Container.jsx";
import PageHeader from "../../components/Layouts/PageHeader.jsx";
import { TextInput, Textarea, Button, Select } from "flowbite-react";
import { Tabs } from "flowbite-react";
import { TabContainer } from "../../components/Layouts/TabContainer.jsx";
import { useNavigate } from "react-router-dom";
import driverService from "../../services/driver.service.js";
import toast from "react-hot-toast";

const CreateDriver = () => {
    const navigate = useNavigate();
    const [driver, setDriver] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        address: '',
        dateOfBirth: '',
        licenseNumber: '',
        gender: 'Male',
        emergencyContact: {
            name: '',
            contactNumber: ''
        },
        drivingExperience: 0,
        vehicleTypes: [],
        profilePicture: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
    });

    const buttons = [
        {
            id: 'create-driver',
            label: driver.addedToDB ? "Save Driver" : "Create Driver",
            icon: "gridicons:add"
        }
    ];

    const handleDriverCreate = async () => {
        // Handle driver creation logic
        const creationResponse = await driverService.createDriver(driver)
            .then(() => {
                toast.success(`${driver.firstName} (Driver) Account created!`)
            })
            .catch((err) => {
                toast.error(err.message)
            })
    };

    const onButtonClick = async (id) => {
        if (id === 'create-driver') {
            await handleDriverCreate();
            return true;
        }
    };

    return (
        <PanelContainer>
            <PageHeader
                title="Create Driver"
                description="Fill the below details to create or update the driver profile"
                buttons={buttons}
                goBack={true}
                onButtonClick={(id) => onButtonClick(id)}
            />
            <TabContainer>
                <Tabs variant="underline">
                    {/* Basic Information Tab */}
                    <Tabs.Item active title="Basic Information">
                        <div className="space-y-6">
                            {/* First Name */}
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <TextInput
                                    id="first-name"
                                    type="text"
                                    value={driver.firstName}
                                    onChange={(e) => setDriver({ ...driver, firstName: e.target.value })}
                                    required
                                    placeholder="Enter driver's first name"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <TextInput
                                    id="last-name"
                                    type="text"
                                    value={driver.lastName}
                                    onChange={(e) => setDriver({ ...driver, lastName: e.target.value })}
                                    required
                                    placeholder="Enter driver's last name"
                                />
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700">
                                    Contact Number
                                </label>
                                <TextInput
                                    id="contact-number"
                                    type="text"
                                    value={driver.contactNumber}
                                    onChange={(e) => setDriver({ ...driver, contactNumber: e.target.value })}
                                    required
                                    placeholder="Enter contact number"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={driver.email}
                                    onChange={(e) => setDriver({ ...driver, email: e.target.value })}
                                    required
                                    placeholder="Enter email address"
                                />
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label htmlFor="date-of-birth" className="block text-sm font-medium text-gray-700">
                                    Date of Birth
                                </label>
                                <TextInput
                                    id="date-of-birth"
                                    type="date"
                                    value={driver.dateOfBirth}
                                    onChange={(e) => setDriver({ ...driver, dateOfBirth: e.target.value })}
                                    required
                                />
                            </div>

                            {/* License Number */}
                            <div>
                                <label htmlFor="license-number" className="block text-sm font-medium text-gray-700">
                                    License Number
                                </label>
                                <TextInput
                                    id="license-number"
                                    type="text"
                                    value={driver.licenseNumber}
                                    onChange={(e) => setDriver({ ...driver, licenseNumber: e.target.value })}
                                    required
                                    placeholder="Enter license number"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <Select
                                    id="gender"
                                    value={driver.gender}
                                    onChange={(e) => setDriver({ ...driver, gender: e.target.value })}
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Select>
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <label htmlFor="emergency-contact-name" className="block text-sm font-medium text-gray-700">
                                    Emergency Contact Name
                                </label>
                                <TextInput
                                    id="emergency-contact-name"
                                    type="text"
                                    value={driver.emergencyContact.name}
                                    onChange={(e) => setDriver({ ...driver, emergencyContact: { ...driver.emergencyContact, name: e.target.value } })}
                                    required
                                    placeholder="Enter emergency contact name"
                                />
                            </div>

                            <div>
                                <label htmlFor="emergency-contact-number" className="block text-sm font-medium text-gray-700">
                                    Emergency Contact Number
                                </label>
                                <TextInput
                                    id="emergency-contact-number"
                                    type="text"
                                    value={driver.emergencyContact.contactNumber}
                                    onChange={(e) => setDriver({ ...driver, emergencyContact: { ...driver.emergencyContact, contactNumber: e.target.value } })}
                                    required
                                    placeholder="Enter emergency contact number"
                                />
                            </div>
                            {/* Driving Experience */}
                            <div>
                                <label htmlFor="driving-experience" className="block text-sm font-medium text-gray-700">
                                    Driving Experience (in years)
                                </label>
                                <TextInput
                                    id="driving-experience"
                                    type="number"
                                    value={driver.drivingExperience}
                                    onChange={(e) => setDriver({ ...driver, drivingExperience: parseInt(e.target.value, 10) || 0 })}
                                    required
                                    placeholder="Enter driving experience in years"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <Textarea
                                    id="address"
                                    value={driver.address}
                                    onChange={(e) => setDriver({ ...driver, address: e.target.value })}
                                    required
                                    placeholder="Enter driver's address"
                                />
                            </div>


                            {/* Profile Picture */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Profile Picture
                                </label>
                                <img src={driver.profilePicture} alt="Driver Profile" className="w-32 h-32 object-cover mb-2" />
                                <TextInput
                                    type="text"
                                    value={driver.profilePicture}
                                    onChange={(e) => setDriver({ ...driver, profilePicture: e.target.value })}
                                    placeholder="Enter profile image URL"
                                />
                            </div>

                        </div>
                    </Tabs.Item>
                </Tabs>
            </TabContainer>
        </PanelContainer>
    );
};

export default CreateDriver;
