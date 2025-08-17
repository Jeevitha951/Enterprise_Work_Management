// src/store/projectsSlice.js
import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { api } from '../utils/mockApi.js'

// Async thunks
export const fetchProjects = createAsyncThunk('projects/fetch', api.getProjects)
export const createProject = createAsyncThunk('projects/create', async (data) => api.createProject(data))

const slice = createSlice({
  name: 'projects',
  initialState: { projects: [], status: 'idle' },
  reducers: {
    // ✅ Local project CRUD
    updateProject(state, action) {
      const { id, changes } = action.payload
      const p = state.projects.find(p => String(p.id) === String(id))
      if (p) Object.assign(p, changes)
    },
    deleteProject(state, action) {
      state.projects = state.projects.filter(p => String(p.id) !== String(action.payload))
    },
    assignUserToProject(state, action) {
      const { projectId, userId } = action.payload
      const p = state.projects.find(p => String(p.id) === String(projectId))
      if (p) {
        if (!p.members) p.members = []
        if (!p.members.includes(userId)) p.members.push(userId)
      }
    },
    removeUserFromProject(state, action) {
      const { projectId, userId } = action.payload
      const p = state.projects.find(p => String(p.id) === String(projectId))
      if (p && p.members) {
        p.members = p.members.filter(u => u !== userId)
      }
    },
    // ✅ If you still want to create tasks tied to projects
    addTaskToProject: {
      reducer(state, action) {
        const { projectId, task } = action.payload
        const p = state.projects.find(p => String(p.id) === String(projectId))
        if (p) {
          if (!p.tasks) p.tasks = []
          p.tasks.push(task)
        }
      },
      prepare({ projectId, title }) {
        return {
          payload: {
            projectId,
            task: {
              id: nanoid(),
              projectId,
              title,
              status: 'Backlog',
              type: 'Feature',
              priority: 'Medium'
            }
          }
        }
      }
    }
  },
  extraReducers: (b) => {
    b
      .addCase(fetchProjects.pending, (s) => { s.status = 'loading' })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.status = 'succeeded'; s.projects = a.payload })
      .addCase(createProject.fulfilled, (s, a) => { s.projects.push(a.payload) })
  }
})

export const {
  updateProject, deleteProject,
  assignUserToProject, removeUserFromProject,
  addTaskToProject
} = slice.actions

export const selectProjects = (state) => state.projects
export default slice.reducer
