import { useState } from "react";
import { PanelContainer } from "../../components/Layouts/Container.jsx";
import PageHeader from "../../components/Layouts/PageHeader.jsx";
import { TextInput, Textarea, Button, Select } from "flowbite-react";
import { Tabs } from "flowbite-react";
import { TabContainer } from "../../components/Layouts/TabContainer.jsx";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user.service.js"; // Updated service name
import toast from "react-hot-toast";

const CreateUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        role: "driver",  // Default role
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

    const roles = ["driver", "manager", "admin"];

    const buttons = [
        {
            id: 'create-user',
            label: "Create User",
            icon: "gridicons:add"
        }
    ];

    const handleUserCreate = async () => {
        try {
            await userService.createUser(user);
            toast.success(`${user.firstName} (${user.role}) account created!`);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const onButtonClick = async (id) => {
        if (id === 'create-user') {
            await handleUserCreate();
        }
    };

    return (
        <PanelContainer>
            <PageHeader
                title="Create User"
                description="Fill in the details to create or update the user profile."
                buttons={buttons}
                goBack={true}
                onButtonClick={onButtonClick}
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
                                    value={user.firstName}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                    required
                                    placeholder="Enter first name"
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
                                    value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                    required
                                    placeholder="Enter last name"
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
                                    value={user.phoneNumber}
                                    onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
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
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                                    value={user.dateOfBirth}
                                    onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <Select
                                    id="role"
                                    value={user.role}
                                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                                    required
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                                    ))}
                                </Select>
                            </div>

                            {/* License Number (Only for Drivers) */}
                            {user.role === "driver" && (
                                <div>
                                    <label htmlFor="license-number" className="block text-sm font-medium text-gray-700">
                                        License Number
                                    </label>
                                    <TextInput
                                        id="license-number"
                                        type="text"
                                        value={user.licenseNumber}
                                        onChange={(e) => setUser({ ...user, licenseNumber: e.target.value })}
                                        required
                                        placeholder="Enter license number"
                                    />
                                </div>
                            )}

                            {/* Gender */}
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <Select
                                    id="gender"
                                    value={user.gender}
                                    onChange={(e) => setUser({ ...user, gender: e.target.value })}
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
                                    value={user.emergencyContact.name}
                                    onChange={(e) => setUser({ ...user, emergencyContact: { ...user.emergencyContact, name: e.target.value } })}
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
                                    value={user.emergencyContact.contactNumber}
                                    onChange={(e) => setUser({ ...user, emergencyContact: { ...user.emergencyContact, contactNumber: e.target.value } })}
                                    placeholder="Enter emergency contact number"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <Textarea
                                    id="address"
                                    value={user.address}
                                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                    </Tabs.Item>
                </Tabs>
            </TabContainer>
        </PanelContainer>
    );
};

export default CreateUser;
