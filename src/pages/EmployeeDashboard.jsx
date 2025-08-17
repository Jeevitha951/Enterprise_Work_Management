import React, { useEffect } from "react";
import useBootstrapData from "../hooks/useBootstrapData.js";
import { useSelector, useDispatch } from "react-redux";
import { selectTasks } from "../store/tasksSlice.js";
import { selectNotifications, startRealtime } from "../store/notificationsSlice.js";
import SettingsPage from "./SettingsPage.jsx";

export default function EmployeeDashboard() {
  useBootstrapData();
  const dispatch = useDispatch();
  const { tasks } = useSelector(selectTasks);
  const { items: notifications } = useSelector(selectNotifications);

  const employeeEmail = localStorage.getItem("email");
  const myTasks = tasks.filter((t) => t.assignedTo === employeeEmail);
  const total = myTasks.length;
  const completed = myTasks.filter((t) => t.status === "Done").length;
  const pending = total - completed;

  const myNotifications = notifications.filter((n) => n.assignedTo === employeeEmail);

  useEffect(() => {
    dispatch(startRealtime());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-5 text-center">
          <p className="text-sm text-gray-500">Assigned Tasks</p>
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

      <div className="bg-white shadow-md rounded-lg p-5">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Notifications</h3>
        <ul className="space-y-2 max-h-48 overflow-auto">
          {myNotifications.slice(-5).reverse().map((n) => (
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
