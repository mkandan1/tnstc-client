import React, { useEffect, useState } from 'react';
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";
import scheduledBusService from '../../services/scheduledbus.service';
import { useNavigate } from 'react-router-dom';
import NormalTable from '../../components/ui/table/NormalTable';
import { convertToIST } from '../../util/convertToIST';

const ScheduledBuses = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  const buttons = [
    { id: 'create-schedule', label: 'Create Schedule', icon: 'gridicons:create' }
  ];

  const headers = [
    { label: "Bus No", field: "bus.busNumber" },
    { label: "Driver", field: "driver.firstName" },
    { label: "Route", field: "route.routeName" },
    { label: "Schedule Time", field: "scheduleTime" },
    { label: "Status", field: "status" },
  ];

  const actions = [
    {
      label: "View",
      icon: "mdi:eye",
      callback: (row) => navigate(row._id),
    },
    {
      label: "Edit",
      icon: "mdi:pencil",
      callback: (row) => navigate(`${row._id}`),
    },
  ];

  const onButtonClick = (id) => {
    if (id === 'create-schedule') {
      navigate("new");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await scheduledBusService.getAllScheduledBuses();
        if (isMounted) {
          // Convert scheduleTime to IST before setting state
          const formattedData = data.map((schedule) => ({
            ...schedule,
            scheduleTime: convertToIST(schedule.scheduleTime),
          }));
          setSchedules(formattedData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSchedules();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PanelContainer>
      <PageHeader
        title={'Schedules'}
        buttons={buttons}
        onButtonClick={onButtonClick}
      />

      <div className="w-screen md:w-auto overflow-x-auto">
        <NormalTable
          headers={headers}
          data={schedules}
          actions={actions}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </PanelContainer>
  );
};

export default ScheduledBuses;