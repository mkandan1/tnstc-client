import React, { useEffect, useState } from "react";
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";
import { TextInput, Select, Button, Tabs } from "flowbite-react";
import { scheduledBusService } from "../../services";
import busService from "../../services/bus.service";
import driverService from "../../services/driver.service";
import routeService from "../../services/route.service";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { TabContainer } from "../../components/Layouts/TabContainer";

const CreateSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedule, setSchedule] = useState({
    bus: "",
    driver: "",
    route: "",
    scheduleTime: "",
    status: "Scheduled",
    comments: "",
    realTimeTracking: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [busData, driverData, routeData] = await Promise.all([
          busService.getAllBuses(),
          driverService.getAllDrivers(),
          routeService.getAllRoutes(),
        ]);
        setBuses(busData.buses);
        setDrivers(driverData);
        setRoutes(routeData);

        if (id) {
          const existingSchedule = await scheduledBusService.getScheduledBusById(id);
          setSchedule(existingSchedule);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "scheduleTime") {
      // Convert local time to UTC before saving
      const utcTime = DateTime.fromISO(value, { zone: "local" }).toUTC().toISO();
      setSchedule((prev) => ({ ...prev, scheduleTime: utcTime }));
    } else {
      setSchedule((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await scheduledBusService.updateScheduledBus(id, schedule);
        toast.success("Schedule updated successfully");
      } else {
        await scheduledBusService.createScheduledBus(schedule);
        toast.success("Schedule created successfully");
      }
      navigate(-1);
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  return (
    <PanelContainer>
      <PageHeader
        title={"Create Schedule"}
        description={"Fill the details to create schedule"}
        buttons={[]}
        goBack={true}
      />

      <TabContainer>
        <Tabs>
          <Tabs.Item title={"Bus Schedule"}>
            <div className="space-y-4">
              <div>
                <label>Bus</label>
                <Select name="bus" value={schedule?.bus} onChange={handleChange} required>
                  <option value="">Select Bus</option>
                  {buses.map((bus) => (
                    <option key={bus?._id} value={bus?._id}>{bus?.busNumber}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label>Driver</label>
                <Select name="driver" value={schedule?.driver} onChange={handleChange} required>
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver?._id} value={driver?._id}>{driver?.firstName + ' ' + driver?.lastName}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label>Route</label>
                <Select name="route" value={schedule?.route} onChange={handleChange} required>
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route?._id} value={route?._id}>{route?.routeName}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label>Schedule Time</label>
                <TextInput type="datetime-local" name="scheduleTime" value={schedule?.scheduleTime} onChange={handleChange} required />
              </div>

              <div>
                <label>Status</label>
                <Select name="status" value={schedule?.status} onChange={handleChange}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="On Route">On Route</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>

              <div>
                <label>Comments</label>
                <TextInput type="text" name="comments" value={schedule?.comments} onChange={handleChange} placeholder="Optional" />
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" name="realTimeTracking" checked={schedule?.realTimeTracking} onChange={handleChange} />
                <label>Enable Real-Time Tracking</label>
              </div>

              <Button onClick={handleSubmit} disabled={loading}>
                {id ? "Update Schedule" : "Create Schedule"}
              </Button>
            </div>
          </Tabs.Item>
        </Tabs>
      </TabContainer>
    </PanelContainer>
  );
}

export default CreateSchedule;