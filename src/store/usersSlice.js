import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { api } from '../utils/mockApi.js'

export const fetchUsers = createAsyncThunk('users/fetch', api.getUsers)

const slice = createSlice({
  name: 'users',
  initialState: { users: [], status: 'idle', currentUser: null },  
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload
    },

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

    updateUser(state, action) {
      if (state.currentUser?.role !== "Admin") return
      const { id, changes } = action.payload
      const existing = state.users.find(u => u.id === id)
      if (existing) {
        Object.assign(existing, changes)
        existing.lastActive = Date.now()
      }
    },

    deleteUser(state, action) {
      if (state.currentUser?.role !== "Admin") return
      state.users = state.users.filter(u => u.id !== action.payload)
    },

    markActivity(state, action) {
      const user = state.users.find(u => u.id === action.payload)
      if (user) {
        user.lastActive = Date.now()
      }
    },

    toggleUserStatus(state, action) {
      if (state.currentUser?.role !== "Admin") return
      const user = state.users.find(u => u.id === action.payload)
      if (user) {
        user.status = user.status === "Active" ? "Inactive" : "Active"
        user.lastActive = Date.now()
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => { s.status = 'loading' })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.users = a.payload
      })
      .addCase(fetchUsers.rejected, (s) => { s.status = 'failed' })
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
