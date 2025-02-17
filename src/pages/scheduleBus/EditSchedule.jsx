import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { scheduledBusService } from "../../services";
import busService from "../../services/bus.service";
import driverService from "../../services/driver.service";
import routeService from "../../services/route.service";
import { Button, Label, Select, TextInput, Spinner, Alert, Tabs } from "flowbite-react";
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";
import { formatDateTime } from "../../util/formateDateTime";
import { TabContainer } from "../../components/Layouts/TabContainer";
import toast from "react-hot-toast";
import urlService from "../../services/url.service";

const EditSchedule = () => {
  const { id } = useParams();
  const scheduleId = urlService.getId();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState({
    bus: "",
    driver: "",
    route: "",
    scheduleTime: "",
    status: "",
  });

  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          const data = await scheduledBusService.getScheduledBusById(id);
          setSchedule({
            bus: data?.bus?._id || "",
            driver: data?.driver?._id || "",
            route: data?.route?._id || "",
            scheduleTime: data?.scheduleTime ? formatDateTime(data.scheduleTime) : "",
            status: data?.status || "Scheduled",
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await scheduledBusService.updateScheduledBus(id, schedule);
      navigate(-1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onButtonClick = async (id) => {
    if (id == 'delete') {
      try {
        await scheduledBusService.deleteScheduledBus(scheduleId);
        toast.success('Schedule has been deleted')
        navigate(-1)
      }
      catch (error) {
        console.error("Failed deleting schedule: ", error.message)
        toast.error("Failed to delete the schedule")
      }
    }
  }

  return (
    <PanelContainer>
      <PageHeader
        title={'Edit Schedule'}
        description={'Edit fields to update the schedule'}
        buttons={[{ id: 'delete', label: 'Delete', icon: 'material-symbols:delete-outline-rounded' }]}
        onButtonClick={onButtonClick}
        goBack={true}
      />
      {error && <Alert color="failure">{error}</Alert>}

      <TabContainer>
        <Tabs>
          <Tabs.Item title={"Bus Schedule"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bus Selection */}
              <div>
                <Label htmlFor="bus" value="Bus" />
                <Select id="bus" name="bus" value={schedule.bus} onChange={handleChange} required>
                  <option value="">Select Bus</option>
                  {buses.map((bus) => (
                    <option key={bus._id} value={bus._id}>{bus?.busNumber}</option>
                  ))}
                </Select>
              </div>

              {/* Driver Selection */}
              <div>
                <Label htmlFor="driver" value="Driver" />
                <Select id="driver" name="driver" value={schedule.driver} onChange={handleChange} required>
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>{driver.firstName} {driver.lastName}</option>
                  ))}
                </Select>
              </div>

              {/* Route Selection */}
              <div>
                <Label htmlFor="route" value="Route" />
                <Select id="route" name="route" value={schedule.route} onChange={handleChange} required>
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route._id} value={route._id}>{route.routeName}</option>
                  ))}
                </Select>
              </div>

              {/* Schedule Time */}
              <div>
                <Label htmlFor="scheduleTime" value="Schedule Time" />
                <TextInput
                  type="datetime-local"
                  id="scheduleTime"
                  name="scheduleTime"
                  value={schedule.scheduleTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Status Selection */}
              <div>
                <Label htmlFor="status" value="Status" />
                <Select id="status" name="status" value={schedule.status} onChange={handleChange} required>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>

              {/* Submit Button */}
              <Button type="submit" color="blue" disabled={isLoading} className="w-full">
                {isLoading ? <Spinner size="sm" /> : "Update Schedule"}
              </Button>
            </form>
          </Tabs.Item>
        </Tabs>
      </TabContainer>
    </PanelContainer>
  );
};

export default EditSchedule;