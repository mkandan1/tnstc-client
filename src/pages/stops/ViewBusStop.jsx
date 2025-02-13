import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelContainer } from '../../components/Layouts/Container';
import PageHeader from '../../components/Layouts/PageHeader';
import { busStopService } from '../../services';
import { MapContainer } from '../../components/features/MapContainer';
import toast from 'react-hot-toast';
import { BusStopManager } from '../../components/features/BusStopManager';
import { getId } from '../../services/url.service';
import { TabContainer } from '../../components/Layouts/TabContainer';
import { Tabs, TextInput } from 'flowbite-react';
import { areObjectsEqual } from '../../util/objectCompraion';

const ViewBusStop = () => {
  const id = getId();
  const navigate = useNavigate();
  const [busStop, setBusStop] = useState({
    name: null,
    coordinates: {
      lng: null,
      lat: null,
    },
    active: true,
  });
  const [dbData, setDbData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const buttons = [
    { id: 'save', label: 'Save', icon: 'fa-solid:save', disabled: isSaveDisabled },
    { id: 'delete', label: 'Delete', icon: 'material-symbols:delete-rounded', disabled: false },
  ];

  useEffect(() => {
    const fetchBusStop = async () => {
      try {
        const response = await busStopService.getBusStopById(id);
        setBusStop(response.busStop);
        setDbData(response.busStop);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to fetch bus stop details');
      } finally {
        setLoading(false);
      }
    };

    fetchBusStop();
  }, [id]);

  useEffect(() => {
    if (busStop && dbData) {
      setIsSaveDisabled(areObjectsEqual(busStop, dbData, ['createdAt', 'updatedAt']));
    }
  }, [busStop, dbData]);

  const handleBusStopAdded = async (busStop) => {
    setBusStop((prev) => ({
      ...prev,
      coordinates: {
        lat: busStop.lat,
        lng: busStop.lng
      },
    }))
  };

  const handleClick = async (btnId) => {
    if (btnId == 'save') {
      try {
        await busStopService.updateBusStop(id, busStop);
        setDbData(busStop);
        setIsSaveDisabled(true);
        toast.success('Bus stop updated successfully');
      } catch (error) {
        toast.error('Failed to update bus stop');
      }
    }
    else if(btnId == 'delete'){
      await busStopService.deleteBusStop(id)
      .then((res)=> {
        toast.success('Stop has been deleted from record')
        navigate('/manager/stops')
      })
      .catch((err)=> toast.error('An error occured'))
    }
  };

  return (
    <PanelContainer>
      <PageHeader title={`Bus Stop: ${busStop.name}`} buttons={buttons} goBack={true} onButtonClick={handleClick} />

      <TabContainer>
        <Tabs>
          <Tabs.Item title="Bus Stop">
            <div className="space-y-20 relative">
              <div className='w-full h-[50vh]'>
                <MapContainer>
                  {(mapInstance) => <BusStopManager mapInstance={mapInstance} onBusStopAdded={handleBusStopAdded} busStop={busStop} />}
                </MapContainer>
              </div>
              <div className='w-96 mt-10'>
                <label className="block text-sm font-medium text-gray-700">
                  Bus Stop Name
                </label>
                <TextInput
                  type="text"
                  placeholder="Stop Name"
                  value={busStop.name || ''}
                  onChange={(e) => {
                    setBusStop((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
              </div>
            </div>
          </Tabs.Item>
        </Tabs>
      </TabContainer>
    </PanelContainer>
  );
};

export default ViewBusStop;