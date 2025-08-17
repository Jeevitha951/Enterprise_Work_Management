import React from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/authSlice.js";

import AdminDashboard from "./AdminDashboard.jsx";
import ManagerDashboard from "./ManagerDashboard.jsx";
import EmployeeDashboard from "./EmployeeDashboard.jsx";

export default function Dashboard() {
  const { user } = useSelector(selectAuth);

  if (!user) return <div className="text-center text-gray-500 mt-10">Loading...</div>;

  return (
    <>
      {user.role === "Admin" && <AdminDashboard />}
      {user.role === "Manager" && <ManagerDashboard />}
      {user.role !== "Admin" && user.role !== "Manager" && <EmployeeDashboard />}
    </>
  );
}
