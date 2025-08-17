import React, { useEffect } from 'react'
import useBootstrapData from '../hooks/useBootstrapData.js'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjects } from '../store/projectsSlice.js'
import { selectTasks } from '../store/tasksSlice.js'
import { selectNotifications, startRealtime } from '../store/notificationsSlice.js'
import { Link } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Dashboard() {
  useBootstrapData()
  const dispatch = useDispatch()
  const { projects } = useSelector(selectProjects)
  const { tasks } = useSelector(selectTasks)
  const { items: notifications } = useSelector(selectNotifications)

  const total = tasks.length
  const completed = tasks.filter(t => t.status === 'Done').length
  const pending = total - completed

  const chartData = {
    labels: ['Total', 'Completed', 'Pending'],
    datasets: [{ label: 'Tasks', data: [total, completed, pending], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'] }]
  }

  useEffect(() => {
    dispatch(startRealtime())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center">
          <p className="text-sm text-gray-500">Projects</p>
          <p className="text-2xl font-semibold text-gray-800">{projects.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center">
          <p className="text-sm text-gray-500">Tasks</p>
          <p className="text-2xl font-semibold text-gray-800">{total}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold text-green-500">{completed}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-semibold text-yellow-500">{pending}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Activity</h3>
          <ul className="space-y-2 max-h-48 overflow-auto">
            {notifications.slice(0, 8).map(n => (
              <li key={n.id} className="text-sm text-gray-600">
                <span className="text-gray-400">{new Date(n.time).toLocaleString()}</span> — {n.message}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Notifications</h3>
          <ul className="space-y-2 max-h-48 overflow-auto">
            {notifications.slice(-5).reverse().map(n => (
              <li key={n.id} className="text-sm bg-gray-50 p-2 rounded text-gray-700">
                <span className="text-gray-400">{new Date(n.time).toLocaleTimeString()}</span> — {n.message}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Task Overview</h3>
        <div style={{ height: '250px', width: '100%' }}>
          <Bar
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Quick Links</h3>
        <div className="flex gap-3">
          <Link className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" to="/projects">Manage Projects</Link>
          <Link className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition" to="/reports">Reports</Link>
        </div>
      </div>
    </div>
  )
}
