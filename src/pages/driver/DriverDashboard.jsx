import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { scheduledBusService } from '../../services'
import { PanelContainer } from '../../components/Layouts/Container'
import PageHeader from '../../components/Layouts/PageHeader'
import NormalTable from '../../components/ui/table/NormalTable'
import { convertToIST } from '../../util/convertToIST'
import { useNavigate } from 'react-router-dom'

const DriverDashboard = () => {
  const [task, setTask] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { user } = useSelector(state => state.user)

  const buttons = [
    { id: 'view-schedule', label: 'View Schedule', icon: 'gridicons:view' },
  ]

  const headers = [
    { label: 'Bus No', field: 'bus.busNumber' },
    { label: 'Route', field: 'route.routeName' },
    { label: 'Schedule Time', field: 'scheduleTime' },
    { label: 'Status', field: 'status' },
    { label: 'Comments', field: 'comments' },
  ]

  const actions = [
    {
      label: 'View',
      icon: 'mdi:eye',
      callback: (row) => navigate(row._id),
    },
    {
      label: 'Edit',
      icon: 'mdi:pencil',
      callback: (row) => navigate(row._id),
    },
  ]

  useEffect(() => {
    const fetchTask = async () => {
      if (user && user._id) {
        try {
          setIsLoading(true)
          const response = await scheduledBusService.getAllScheduledBuses({ driverId: user._id })
          const formattedData = response.map((schedule) => ({
            ...schedule,
            scheduleTime: convertToIST(schedule.scheduleTime),
          }));
          setTask(formattedData)
        } catch (error) {
          setError(error.message)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTask()
  }, [user])

  return (
    <PanelContainer>
      <PageHeader
        title={'Driver Dashboard'}
        buttons={[]}
        description={`You have ${task.length} tasks assigned.`}
      />

      <div className="w-screen md:w-auto overflow-x-auto">
        <NormalTable
          headers={headers}
          data={task}
          actions={actions}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </PanelContainer>
  )
}

export default DriverDashboard