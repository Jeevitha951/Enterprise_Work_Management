import React from 'react'
import { useSelector } from 'react-redux'
import { selectProjects } from '../store/projectsSlice.js'
import { selectTasks } from '../store/tasksSlice.js'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ReportsPage() {
  const { projects } = useSelector(selectProjects)
  const { tasks } = useSelector(selectTasks)

  const statuses = ['Backlog', 'In Progress', 'Review', 'Done']
  const byStatus = statuses.map(s => tasks.filter(t => t.status === s).length)

  const data = {
    labels: statuses,
    datasets: [
      {
        label: 'Tasks by Status',
        data: byStatus,
        backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#4ade80'],
        hoverBackgroundColor: ['#f87171cc', '#fbbf24cc', '#60a5facc', '#4ade80cc']
      }
    ]
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Reports</h2>

      <div className="card p-4">
        <h3 className="font-medium mb-3">Tasks by Status</h3>
        <Pie data={data} />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">Export</h3>
        <p className="text-sm opacity-80">
          In this frontend-only demo, exporting would call the backend. You can still copy data from the charts above.
        </p>
      </div>
    </div>
  )
}
