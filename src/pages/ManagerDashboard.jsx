import React, { useEffect } from "react";
import useBootstrapData from "../hooks/useBootstrapData.js";
import { useSelector, useDispatch } from "react-redux";
import { selectProjects } from "../store/projectsSlice.js";
import { selectTasks } from "../store/tasksSlice.js";
import { selectNotifications, startRealtime } from "../store/notificationsSlice.js";
import SettingsPage from "./SettingsPage.jsx";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ManagerDashboard() {
  useBootstrapData();
  const dispatch = useDispatch();
  const { projects } = useSelector(selectProjects);
  const { tasks } = useSelector(selectTasks);
  const { items: notifications } = useSelector(selectNotifications);

  const managerEmail = localStorage.getItem("email") || "";

  const managerProjects = projects.filter((p) => p.ownerEmail === managerEmail);
  const managerTasks = tasks.filter((t) => managerProjects.some((p) => p.id === t.projectId));

  const total = managerTasks.length;
  const completed = managerTasks.filter((t) => t.status === "Done").length;
  const pending = total - completed;

  const managerNotifications = notifications.filter((n) =>
    managerProjects.some((p) => p.id === n.projectId)
  );

  useEffect(() => {
    dispatch(startRealtime());
  }, [dispatch]);

  const doughnutData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ["#4ade80", "#facc15"],
        hoverBackgroundColor: ["#22c55e", "#eab308"],
      },
    ],
  };

  const projectLabels = managerProjects.map((p) => p.name);
  const tasksPerProject = managerProjects.map(
    (p) => managerTasks.filter((t) => t.projectId === p.id).length
  );

  const barData = {
    labels: projectLabels,
    datasets: [
      {
        label: "Tasks per Project",
        data: tasksPerProject,
        backgroundColor: ["#60a5fa", "#f87171", "#fbbf24", "#34d399", "#a78bfa"],
      },
    ],
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-lg p-5 text-center">
          <p className="text-sm text-gray-500">My Projects</p>
          <p className="text-2xl font-semibold text-gray-800">{managerProjects.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5 text-center">
          <p className="text-sm text-gray-500">Tasks</p>
          <p className="text-2xl font-semibold text-gray-800">{total}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5 text-center">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold text-green-500">{completed}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-5 text-center">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-semibold text-yellow-500">{pending}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">Task Completion</h3>
          <Doughnut data={doughnutData} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">Tasks per Project</h3>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: true, text: "Tasks per Project" },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5 max-h-64 overflow-auto">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Notifications</h3>
        <ul className="space-y-2">
          {managerNotifications.slice(-8).reverse().map((n) => (
            <li key={n.id} className="text-sm bg-gray-50 p-2 rounded text-gray-700">
              <span className="text-gray-400">{new Date(n.time).toLocaleTimeString()}</span> — {n.message}
            </li>
          ))}
        </ul>
      </div>

      <SettingsPage />
    </div>
  );
}
