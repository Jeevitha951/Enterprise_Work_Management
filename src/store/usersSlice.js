import { createSlice, nanoid } from '@reduxjs/toolkit'
import usersData from '../data/users.json' // import dummy data

const slice = createSlice({
  name: 'users',
  initialState: { users: usersData, currentUser: null },  
  reducers: {
    // Login (set the current user in slice)
    setCurrentUser(state, action) {
      state.currentUser = action.payload
    },

    // Create user (Admin-only)
    createUser: {
      reducer(state, action) {
        if (state.currentUser?.role !== "Admin") return
        state.users.push(action.payload)
      },
      prepare(user) {
        return {
          payload: {
            id: nanoid(),
            name: user.name || "New User",
            email: user.email || "",
            role: user.role || "Employee",
            status: "Active",
            lastActive: Date.now(),
          }
        }
      }
    },

    // Update user (Admin-only)
    updateUser(state, action) {
      if (state.currentUser?.role !== "Admin") return
      const { id, changes } = action.payload
      const existing = state.users.find(u => u.id === id)
      if (existing) {
        Object.assign(existing, changes)
        existing.lastActive = Date.now()
      }
    },

    // Delete user (Admin-only)
    deleteUser(state, action) {
      if (state.currentUser?.role !== "Admin") return
      state.users = state.users.filter(u => u.id !== action.payload)
    },

    // Mark user activity (self updates)
    markActivity(state, action) {
      const user = state.users.find(u => u.id === action.payload)
      if (user) {
        user.lastActive = Date.now()
      }
    },

    // Toggle user status (Admin-only)
    toggleUserStatus(state, action) {
      if (state.currentUser?.role !== "Admin") return
      const user = state.users.find(u => u.id === action.payload)
      if (user) {
        user.status = user.status === "Active" ? "Inactive" : "Active"
        user.lastActive = Date.now()
      }
    }
  }
})

export const { 
  setCurrentUser,
  createUser, 
  updateUser, 
  deleteUser, 
  markActivity, 
  toggleUserStatus 
} = slice.actions

export const selectUsers = (state) => state.users

export default slice.reducer
