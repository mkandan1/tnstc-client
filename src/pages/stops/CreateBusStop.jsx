import React, { useState } from 'react'
import { PanelContainer } from '../../components/Layouts/Container'
import PageHeader from '../../components/Layouts/PageHeader'
import { post } from '../../api/api'
import toast from 'react-hot-toast'
import { delayedNavigation } from '../../util/navigate'
import { TabContainer } from '../../components/Layouts/TabContainer'
import { Tabs, TextInput } from 'flowbite-react'
import { MapContainer } from '../../components/features/MapContainer'
import { BusStopManager } from '../../components/features/BusStopManager'
import { useNavigate } from 'react-router-dom'

const CreateBusStop = () => {
  const [busStop, setBusStop] = useState({
    name: null,
    coordinates: {
      lat: null,
      lng: null
    },
    code: null,
    active: true
  })
  const navigate = useNavigate()
  const buttons = [
    { id: 'create', label: 'Create Stop', icon: '', disabled: Object.values(busStop).some(val => val == null) },
    { id: 'save-n-create-another', label: 'Save & Create another', icon: '', disabled: Object.values(busStop).some(val => val == null) }
  ]

  const buttonClick = async (id) => {

    if (Object.values(busStop).some(val => val == null)) {
      return
    }

    if (id == 'create') {
      await post('/bus-stops', busStop).then((data) => {
        toast.success('Bus Stop is Created')
        navigate('/manager/stops')
      })
    }
    else if (id == 'save-n-create-another') {
      await post('/bus-stops', busStop).then((data) => {
        toast.success('Bus Stop is Created')
      })

      setBusStop({
        name: "",
        coordinates: {
          lat: null,
          lng: null
        },
        code: "",
        active: true
      })
    }
  }

  const handleBusStopAdded = (busStop) => {
    console.log("New bus stop added:", busStop);
    setBusStop((prev)=> ({...prev,
      coordinates: {
        lat: busStop.lat,
        lng: busStop.lng
      },
    }))
  };

  return (
    <PanelContainer>
      <PageHeader
        title={'Create Bus Stop'}
        buttons={buttons}
        onButtonClick={buttonClick}
        goBack
      />

      <TabContainer>
        <Tabs>
          <Tabs.Item title="Bus Stop">
            <div className="relative">
              <div className='w-full h-[50vh]'>
                <MapContainer>
                  {(mapInstance) => <BusStopManager mapInstance={mapInstance} onBusStopAdded={handleBusStopAdded} busStop={busStop} />}
                </MapContainer>
              </div>
              {/* Origin Input */}
              <div className='w-96 mt-10'>
                <label className="block text-sm font-medium text-gray-700">
                  Bus Stop Name
                </label>
                <TextInput
                  type="text"
                  placeholder="Stop Name"
                  value={busStop.name}
                  onChange={(e) => {
                    setBusStop((prev) => ({ ...prev, name: e.target.value }))
                  }}
                />
              </div>
              <div className='w-96 mt-2'>
                <label className="block text-sm font-medium text-gray-700">
                  Bus Stop Code
                </label>
                <TextInput
                  type="text"
                  placeholder="Stop Code"
                  value={busStop.code}
                  onChange={(e) => {
                    setBusStop((prev) => ({ ...prev, code: e.target.value }))
                  }}
                />
              </div>
            </div>
          </Tabs.Item>
        </Tabs>
      </TabContainer>
    </PanelContainer>
  )
}

export default CreateBusStop