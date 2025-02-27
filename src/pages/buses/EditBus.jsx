import { useEffect, useState } from "react";
import { areObjectsEqual } from "../../util/objectCompraion.js";
import PageHeader from "../../components/Layouts/PageHeader.jsx";
import { PanelContainer } from "../../components/Layouts/Container.jsx";
import { Loading } from "../../components/common/Loading.jsx";
import { TabContainer } from "../../components/Layouts/TabContainer.jsx";
import { Tabs, TextInput, Select, Checkbox, Button, FileInput } from "flowbite-react";
import busService from "../../services/bus.service.js";
import urlService from "../../services/url.service.js";
import toast from "react-hot-toast";
import { delayedNavigation } from "../../util/navigate.js";
import { useNavigate } from "react-router-dom";

export default function EditBus() {
  const [loading, setLoading] = useState(true);
  const [originalBus, setOriginalBus] = useState(null);
  const navigate = useNavigate();
  const [bus, setBus] = useState({
    busNumber: "",
    busName: "",
    isAc: false,
    isLowFloor: false,
    passengerType: "Regular",
    specialService: false,
    isNightService: false,
    passengerCapacity: "",
    busType: "City",
    fuelType: "Diesel",
    ticketingSystem: "Manual",
    liveTrackingUrl: "",
    busImage: null, // New state for storing the selected image
  });


  const busId = urlService.getId();
  const [buttons, setButtons] = useState([
    {
      id: "save-bus",
      label: "Save",
      icon: "fa-solid:save",
      disabled: true,
    },
    {
      id: "delete-bus",
      label: "Delete",
      icon: "material-symbols:delete-rounded",
    },
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBus((prev) => ({
        ...prev,
        busImage: file,
        previewImage: imageUrl, // ✅ Store preview URL
      }));
    }
  };

  const fetchBusData = async () => {
    try {
      const busData = await busService.getBusById(busId);
      setBus(busData.bus);
      setBus((prev)=> ({...prev, previewImage: busData.bus.busImage}))
      setOriginalBus(busData.bus);
    } catch (error) {
      console.error("Error fetching bus data:", error);
      toast.error("Failed to load bus data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!busId) {
      console.error("No busId found, API call skipped!");
      return;
    }
    fetchBusData();
  }, [busId]);


  useEffect(() => {
    if (bus && originalBus) {
      const hasChanged = !areObjectsEqual(bus, originalBus, ["createdAt", "updatedAt"]);
      setButtons((prev) =>
        prev.map((button) => (button.id === "save-bus" ? { ...button, disabled: !hasChanged } : button))
      );
    }
  }, [bus, originalBus]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBus((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveBus = async () => {
    if (!busData.busNumber || !busData.passengerCapacity) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();

    Object.entries(busData).forEach(([key, value]) => {
      if (key === "busImage" && value instanceof File) {
        formData.append("busImage", value); // ✅ Append new image if provided
      } else {
        formData.append(key, value);
      }
    });

    try {
      await busService.updateBus(busId, formData, true);
      toast.success("Bus details updated successfully!");
    } catch (error) {
      console.error("Error updating bus:", error);
      toast.error("Failed to update bus. Please try again.");
    }
  };


  const handleDeleteBus = async () => {
    try {
      await busService.deleteBus(busId);
      toast.success("Bus has been deleted!")
      navigate(-1);
    }
    catch (error) {
      console.error("Error deleting bus:", error);
      toast.error("Failed to delete bus.");
    }
  }

  const onButtonClick = async (id) => {
    if (id === "save-bus") {
      await handleSaveBus();
      return true;
    }
    else if (id == 'delete-bus') {
      await handleDeleteBus();
    }
    return;
  };

  return (
    <PanelContainer>
      <Loading show={loading} />
      <PageHeader
        title={`Buses > ${bus.busNumber}`}
        description="Edit bus details"
        buttons={buttons}
        onButtonClick={onButtonClick}
        goBack
      />
      <TabContainer>
        <Tabs variant="underline">
          <Tabs.Item active title="Basic Information">
            <div className="space-y-4">
              <div>
                <label>Bus Number</label>
                <TextInput name="busNumber" value={bus.busNumber} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bus Name</label>
                <TextInput
                  name="busName"
                  value={bus.busName}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Bus Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Bus Image</label>
                <FileInput accept="image/*" onChange={handleImageChange} />

                {bus.previewImage && (
                  <div className="mt-2">
                    <img
                      src={bus.previewImage}
                      alt="Bus Preview"
                      className="w-40 h-24 object-cover border rounded-lg shadow"
                    />
                  </div>
                )}
              </div>
              <div>
                <label>Passenger Type</label>
                <Select name="passengerType" value={bus.passengerType} onChange={handleChange}>
                  <option value="Regular">Regular</option>
                  <option value="Senior Citizen">Senior Citizen</option>
                  <option value="Student">Student</option>
                  <option value="Differently-Abled">Differently-Abled</option>
                </Select>
              </div>
              <div>
                <label>Passenger Capacity</label>
                <TextInput type="number" name="passengerCapacity" value={bus.passengerCapacity} onChange={handleChange} required />
              </div>
              <div>
                <label>Bus Type</label>
                <Select name="busType" value={bus.busType} onChange={handleChange}>
                  <option value="City">City</option>
                  <option value="Intercity">Intercity</option>
                  <option value="Suburban">Suburban</option>
                  <option value="Special">Special</option>
                </Select>
              </div>
              <div>
                <label>Fuel Type</label>
                <Select name="fuelType" value={bus.fuelType} onChange={handleChange}>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </Select>
              </div>
              <div>
                <label>Ticketing System</label>
                <Select name="ticketingSystem" value={bus.ticketingSystem} onChange={handleChange}>
                  <option value="Manual">Manual</option>
                  <option value="Online">Online</option>
                  <option value="Both">Both</option>
                </Select>
              </div>
              <div>
                <label>Live Tracking URL (Optional)</label>
                <TextInput name="liveTrackingUrl" value={bus.liveTrackingUrl} onChange={handleChange} />
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Additional Features">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox name="isAc" checked={bus.isAc} onChange={handleChange} />
                <label className="text-sm font-medium text-gray-700">AC Bus</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox name="isLowFloor" checked={bus.isLowFloor} onChange={handleChange} />
                <label className="text-sm font-medium text-gray-700">Low Floor Bus</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox name="specialService" checked={bus.specialService} onChange={handleChange} />
                <label className="text-sm font-medium text-gray-700">Special Service</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox name="isNightService" checked={bus.isNightService} onChange={handleChange} />
                <label className="text-sm font-medium text-gray-700">Night Service</label>
              </div>
            </div>
          </Tabs.Item>
        </Tabs>
      </TabContainer>
    </PanelContainer>
  );
};