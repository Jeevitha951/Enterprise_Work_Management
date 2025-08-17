// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import projectsReducer from "./projectsSlice.js";
import tasksReducer from "./tasksSlice.js";
import notificationsReducer from "./notificationsSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
  },
});
