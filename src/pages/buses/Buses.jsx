import React, { useEffect, useState } from 'react'
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";
import busService from '../../services/bus.service';
import { useNavigate } from 'react-router-dom';
import NormalTable from '../../components/ui/table/NormalTable';

export default function Buses() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  const buttons = [
    { id: 'create-bus', label: 'Create Bus', icon: 'gridicons:create' }
  ];

  const headers = [
    { label: "Bus No", field: "busNumber" },
    { label: "Booking Method", field: "ticketingSystem" },
    { label: "Passenger Type", field: "passengerType" },
    { label: "Bus Type", field: "busType" },
    { label: "Fuel Type", field: "fuelType" },
  ]

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
    if(id == 'create-bus'){
      navigate("new");
    }
  }

  useEffect(() => {
    let isMounted = true;

    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await busService.getAllBuses();
        if (isMounted) {
          const formattedData = data.buses.map((route) => ({
            ...route,
            isActive: route.isAc ? "Active" : "Inactive",
          }));
          setBuses(formattedData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted)
          setLoading(false);
      }
    };

    fetchRoutes();

    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <PanelContainer>
      <PageHeader
        title={'Buses'}
        buttons={buttons}
        onButtonClick={onButtonClick}
      />

      <div className="w-screen md:w-auto overflow-x-auto">
        <NormalTable
          headers={headers}
          data={buses}
          actions={actions}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </PanelContainer>
  )
}
