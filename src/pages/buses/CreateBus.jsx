import React, { useState } from "react";
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";
import { TextInput, Select, Checkbox, Tabs } from "flowbite-react";
import { Button } from "../../components/ui/button/Button";
import busService from "../../services/bus.service";
import toast from "react-hot-toast";
import { TabContainer } from "../../components/Layouts/TabContainer";

export const CreateBus = () => {
  const [busData, setBusData] = useState({
    busNumber: "",
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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBusData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveBus = async () => {
    if (!busData.busNumber || !busData.passengerCapacity) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await busService.createBus(busData);
      toast.success("Bus created successfully!");
    } catch (error) {
      console.error("Error creating bus:", error);
      toast.error("Failed to create bus. Please try again.");
    }
  };

  return (
    <PanelContainer>
      <PageHeader
        title="Create Bus"
        buttons={[{ id: "save-bus", label: "Save Bus" }]}
        description={"Fill the details to create bus"}
        goBack
        onButtonClick={saveBus}
      />
      <TabContainer>
        <Tabs>
          <Tabs.Item title="Bus Information">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bus Number</label>
                <TextInput
                  name="busNumber"
                  value={busData.busNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Passenger Type</label>
                <Select name="passengerType" value={busData.passengerType} onChange={handleChange}>
                  <option value="Regular">Regular</option>
                  <option value="Senior Citizen">Senior Citizen</option>
                  <option value="Student">Student</option>
                  <option value="Differently-Abled">Differently-Abled</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Passenger Capacity</label>
                <TextInput
                  name="passengerCapacity"
                  type="number"
                  value={busData.passengerCapacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bus Type</label>
                <Select name="busType" value={busData.busType} onChange={handleChange}>
                  <option value="City">City</option>
                  <option value="Intercity">Intercity</option>
                  <option value="Suburban">Suburban</option>
                  <option value="Special">Special</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                <Select name="fuelType" value={busData.fuelType} onChange={handleChange}>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ticketing System</label>
                <Select name="ticketingSystem" value={busData.ticketingSystem} onChange={handleChange}>
                  <option value="Manual">Manual</option>
                  <option value="Online">Online</option>
                  <option value="Both">Both</option>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox name="isAc" checked={busData.isAc} onChange={handleChange} />
                <label className="text-sm font-medium text-gray-700">AC Bus</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox name="isLowFloor" checked={busData.isLowFloor} onChange={handleChange} />
                <label className="text-sm font-medium text-gray-700">Low Floor Bus</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox name="specialService" checked={busData.specialService} onChange={handleChange} />
                <label className="text-sm font-medium text-gray-700">Special Service</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox name="isNightService" checked={busData.isNightService} onChange={handleChange} />
                <label className="text-sm font-medium text-gray-700">Night Service</label>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700">Live Tracking URL (Optional)</label>
                <TextInput
                  name="liveTrackingUrl"
                  value={busData.liveTrackingUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Tabs.Item>
        </Tabs>
      </TabContainer>
    </PanelContainer>
  );
};

export default CreateBus;
