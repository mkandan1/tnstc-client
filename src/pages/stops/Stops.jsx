import React, { useEffect, useState } from 'react'
import { PanelContainer } from '../../components/Layouts/Container'
import PageHeader from '../../components/Layouts/PageHeader'
import { useNavigate } from 'react-router-dom'
import NormalTable from '../../components/ui/table/NormalTable'
import { busStopService } from '../../services'

const Stops = () => {
  const navigate = useNavigate();
  const [busStops, setBusStops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const buttons = [
    { id: 'create-stop', label: 'Create Bus Stop', icon: 'gridicons:create' }
  ]

  const headers = [
    { label: "Bus Stop", field: "name" },
    { label: "Status", field: "active" },
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
      callback: (row) => navigate(`${row._id}/edit`),
    },
  ];

  useEffect(()=> {
    let isMounted = true;

    const fetchBusStops = async () => {
      try {
        const response = await busStopService.getAllBusStops(); 
        if (isMounted) {
          const formattedData = response.busStops.map((stop) => ({
            ...stop,
            active: stop.active ? "Active" : "Inactive",
          }));
          setBusStops(formattedData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    

    fetchBusStops();

    return () => {
      isMounted = false;
    };
  }, [])
  return (
    <PanelContainer>
      <PageHeader
        title={'Bus Stops'}
        description={`You have ${busStops.length} bus stops`}
        buttons={buttons}
        onButtonClick={() => navigate('new')}
      />

      <div className="w-screen md:w-auto overflow-x-auto">
        <NormalTable
          headers={headers}
          data={busStops}
          actions={actions}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </PanelContainer>
  )
}

export default Stops
