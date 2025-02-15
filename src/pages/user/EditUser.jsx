import { useEffect, useState } from "react";
import { areObjectsEqual } from "../../util/objectCompraion.js";
import PageHeader from "../../components/Layouts/PageHeader.jsx";
import { PanelContainer } from "../../components/Layouts/Container.jsx";
import { Loading } from "../../components/common/Loading.jsx";
import { TabContainer } from "../../components/Layouts/TabContainer.jsx";
import { Tabs, Button, TextInput, Select } from "flowbite-react";
import { userService } from "../../services/user.service.js";
import  urlService  from "../../services/url.service.js";
import toast from "react-hot-toast";

const EditUser = () => {
    const [loading, setLoading] = useState(true);
    const [originalUser, setOriginalUser] = useState(null);
    const [showDeleteModel, setShowDeleteModel] = useState(false);
    const userId = urlService.getId();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        address: '',
        dateOfBirth: '',
        role: 'User', // Default role
        isActive: true,
        gender: 'Male',
        emergencyContact: {
            name: '',
            contactNumber: ''
        },
        profilePicture: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
        permissions: [],
        addedToDB: false
    });

    const [buttons, setButtons] = useState([
        {
            id: 'save-user',
            label: "Save",
            icon: "fa-solid:save",
            disabled: true
        },
        {
            id: 'delete-user',
            label: "Delete",
            icon: "material-symbols:delete-rounded"
        }
    ]);

    const formattedDate = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : '';

    const fetchUserData = async () => {
        try {
            const userData = await userService.getUserById(userId);
            setUser(userData);
            setOriginalUser(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (user && originalUser) {
            const hasChanged = !areObjectsEqual(user, originalUser, ['createdAt', 'updatedAt', 'profilePicture']);
            setButtons((prev) =>
                prev.map((button) =>
                    button.id === 'save-user' ? { ...button, disabled: !hasChanged } : button
                )
            );
        }
    }, [user, originalUser]);

    const onButtonClick = async (id) => {
        if (id === 'save-user') {
            await handleUserEdit();
            return true;
        } else {
            setShowDeleteModel(true);
            return;
        }
    };

    const handleUserEdit = async () => {
        const updatedUser = { ...user };
        delete updatedUser.createdAt;
        delete updatedUser.updatedAt;

        try {
            await userService.updateUser(userId, updatedUser);
            toast.success('User data updated');
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    return (
        <PanelContainer>
            <Loading show={loading} />
            <PageHeader
                title={`Users > ${user.firstName} ${user.lastName}`}
                description={"Edit user profile details"}
                buttons={buttons}
                onButtonClick={onButtonClick}
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
                                    value={user.firstName}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <TextInput
                                    type="text"
                                    value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                            <div>
                                <label>Email</label>
                                <TextInput
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                            <div>
                                <label>Contact Number</label>
                                <TextInput
                                    type="text"
                                    value={user.contactNumber}
                                    onChange={(e) => setUser({ ...user, contactNumber: e.target.value })}
                                    placeholder="Enter contact number"
                                    required
                                />
                            </div>
                            <div>
                                <label>Date of Birth</label>
                                <TextInput
                                    type="date"
                                    value={formattedDate}
                                    onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Gender</label>
                                <Select
                                    value={user.gender}
                                    onChange={(e) => setUser({ ...user, gender: e.target.value })}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Select>
                            </div>
                            <div>
                                <label>Role</label>
                                <Select
                                    value={user.role}
                                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                                >
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Driver">Driver</option>
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
                                    value={user.emergencyContact.name}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            emergencyContact: { ...user.emergencyContact, name: e.target.value }
                                        })
                                    }
                                    placeholder="Enter emergency contact name"
                                    required
                                />
                            </div>
                            <div>
                                <label>Contact Number</label>
                                <TextInput
                                    type="text"
                                    value={user.emergencyContact.contactNumber}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            emergencyContact: { ...user.emergencyContact, contactNumber: e.target.value }
                                        })
                                    }
                                    placeholder="Enter emergency contact number"
                                    required
                                />
                            </div>
                        </div>
                    </Tabs.Item>
                </Tabs>
            </TabContainer>
        </PanelContainer>
    );
};

export default EditUser;
