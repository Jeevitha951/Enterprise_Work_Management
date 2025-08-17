import { createSlice } from '@reduxjs/toolkit'

let interval

const slice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {
    push(state, action) {
      state.items.unshift(action.payload)
    }
  }
})

// ❌ removed `export const { push } = slice.actions`
const { push } = slice.actions  // keep private

export const selectNotifications = (s) => s.notifications

export const startRealtime = () => (dispatch) => {
  if (interval) clearInterval(interval)
  interval = setInterval(() => {
    const messages = [
      'New comment on a task',
      'Project updated',
      'User joined a project',
      'Task moved to Review',
      'Password policy updated'
    ]
    const msg = messages[Math.floor(Math.random() * messages.length)]
    dispatch(push({ id: crypto.randomUUID(), message: msg, time: Date.now() }))
  }, 7000)
}

export default slice.reducer
