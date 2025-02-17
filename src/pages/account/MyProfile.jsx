import React, { useEffect, useState } from "react";
import { Button, Label, TextInput, Spinner, Alert, Select, Tabs } from "flowbite-react";
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";
import { userService } from "../../services/user.service";
import { formatDateTime } from "../../util/formateDateTime";
import toast from "react-hot-toast";
import { TabContainer } from "../../components/Layouts/TabContainer";

const MyProfile = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        emergencyContact: { name: "", contactNumber: "" },
    });

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await userService.currentUser();
                setUser({ ...response, dateOfBirth: response.dateOfBirth ? response.dateOfBirth.split("T")[0] : '' });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await userService.updateUser(user._id, user);
            toast.success("Profile updated successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PanelContainer>
            <PageHeader title="My Profile" />
            {error && <Alert color="failure">{error}</Alert>}

            <TabContainer>
                <Tabs>
                    <Tabs.Item title={"My Profile"}>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <Label htmlFor="firstName" value="First Name" />
                                <TextInput id="firstName" name="firstName" value={user.firstName} onChange={handleChange} required />
                            </div>

                            <div>
                                <Label htmlFor="lastName" value="Last Name" />
                                <TextInput id="lastName" name="lastName" value={user.lastName} onChange={handleChange} required />
                            </div>

                            <div>
                                <Label htmlFor="email" value="Email" />
                                <TextInput id="email" name="email" value={user.email} disabled />
                            </div>

                            <div>
                                <Label htmlFor="phoneNumber" value="Phone Number" />
                                <TextInput id="phoneNumber" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} required />
                            </div>

                            <div>
                                <Label htmlFor="gender" value="Gender" />
                                <Select id="gender" name="gender" value={user.gender} onChange={handleChange} required>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="dateOfBirth" value="Date of Birth" />
                                <TextInput type="date" id="dateOfBirth" name="dateOfBirth" value={user.dateOfBirth} onChange={handleChange} required />
                            </div>

                            <div>
                                <Label htmlFor="address" value="Address" />
                                <TextInput id="address" name="address" value={user.address} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="emergencyContactName" value="Emergency Contact Name" />
                                <TextInput id="emergencyContactName" name="emergencyContact.name" value={user.emergencyContact.name} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="emergencyContactNumber" value="Emergency Contact Number" />
                                <TextInput id="emergencyContactNumber" name="emergencyContact.contactNumber" value={user.emergencyContact.contactNumber} onChange={handleChange} />
                            </div>

                            <Button type="submit" color="blue" disabled={isLoading} className="w-full">
                                {isLoading ? <Spinner size="sm" /> : "Update Profile"}
                            </Button>
                        </form>
                    </Tabs.Item>
                </Tabs>
            </TabContainer>
        </PanelContainer>
    );
};

export default MyProfile;
