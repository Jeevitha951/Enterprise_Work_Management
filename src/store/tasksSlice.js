// src/store/tasksSlice.js
import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { api } from '../utils/mockApi.js'

// Async fetch
export const fetchTasks = createAsyncThunk('tasks/fetch', api.getTasks)

const slice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], status: 'idle' },
  reducers: {
    createTask: {
      reducer(state, action) {
        state.tasks.push(action.payload)
      },
      prepare({ projectId, title, description = '', type = 'Feature', priority = 'Medium', dueDate = null }) {
        return {
          payload: {
            id: nanoid(),
            projectId,
            title,
            description,
            status: 'Backlog',
            type,
            priority,
            dueDate: dueDate ? new Date(dueDate).toString() : null,
            attachments: [],
            comments: []
          }
        }
      }
    },
    updateTask(state, action) {
      const { id, changes } = action.payload
      const t = state.tasks.find(t => String(t.id) === String(id))
      if (t) {
        t.title = changes.title ?? t.title
        t.description = changes.description ?? t.description
        t.type = changes.type ?? t.type
        t.priority = changes.priority ?? t.priority
        t.dueDate = changes.dueDate ? new Date(changes.dueDate).toString() : null
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(t => String(t.id) !== String(action.payload))
    },
    updateTaskStatus(state, action) {
      const { id, status } = action.payload
      const t = state.tasks.find(t => String(t.id) === String(id))
      if (t) t.status = status
    },
    addComment(state, action) {
      const { taskId, text } = action.payload
      const t = state.tasks.find(t => String(t.id) === String(taskId))
      if (t) {
        if (!t.comments) t.comments = []   // Initialize if undefined
        t.comments.push({ id: nanoid(), text, time: Date.now() })
      }
    },
    addAttachment(state, action) {
      const { taskId, file } = action.payload
      const t = state.tasks.find(t => String(t.id) === String(taskId))
      if (t) {
        if (!t.attachments) t.attachments = []  // Initialize if undefined
        t.attachments.push({ id: nanoid(), file, time: Date.now() })
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.status = 'loading' })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.tasks = action.payload.map(t => ({
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate).toString() : null,
          comments: t.comments ?? [],
          attachments: t.attachments ?? []
        }))
      })
  }
})

export const { 
  createTask, updateTask, deleteTask, 
  updateTaskStatus, addComment, addAttachment 
} = slice.actions

export const selectTasks = (state) => state.tasks

export const selectTasksByProject = (projectId) => (state) =>
  state.tasks.tasks.filter(t => String(t.projectId) === String(projectId))

export default slice.reducer
