import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../utils/mockApi.js'
import { toast } from 'react-toastify'

export const login = createAsyncThunk('auth/login', async (cred, { rejectWithValue }) => {
  try { 
    return await api.login(cred) 
  } catch (e) { 
    return rejectWithValue(e.message) 
  }
})

export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try { 
    return await api.signup(data) 
  } catch (e) { 
    return rejectWithValue(e.message) 
  }
})

export const fetchSession = createAsyncThunk('auth/session', async () => api.getSession())
export const updateProfile = createAsyncThunk('auth/updateProfile', async (data) => api.updateProfile(data))
export const changePassword = createAsyncThunk('auth/changePassword', async (data, { rejectWithValue }) => {
  try { 
    await api.changePassword(data); 
    return true 
  } catch (e) { 
    return rejectWithValue(e.message) 
  }
})

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, isAuthenticated: false, status: 'idle', error: null },
  reducers: {
    logout(state) {
      api.logout()
      state.user = null
      state.token = null
      state.isAuthenticated = false
    }
  },
  extraReducers: (b)=> {
    b
    .addCase(login.pending, (s)=>{ s.status = 'loading'; s.error=null })
    .addCase(login.fulfilled, (s, a)=>{ 
      s.status='succeeded'; 
 
      s.user = { 
        id: a.payload.user.id, 
        name: a.payload.user.name, 
        email: a.payload.user.email, 
        role: a.payload.user.role || "Employee"   
      }
      s.token=a.payload.token
      s.isAuthenticated=true
    })
    .addCase(login.rejected, (s,a)=>{ s.status='failed'; s.error=a.payload || 'Login failed' })

    .addCase(signup.pending, (s)=>{ s.status = 'loading'; s.error=null })
    .addCase(signup.fulfilled, (s, a)=>{ 
      s.status='succeeded'; 
      s.user = { 
        id: a.payload.user.id, 
        name: a.payload.user.name, 
        email: a.payload.user.email, 
        role: a.payload.user.role || "Employee"   
      }
      s.token=a.payload.token
      s.isAuthenticated=true 
      toast.success('Account created successfully!') 
    })
    .addCase(signup.rejected, (s,a)=>{ s.status='failed'; s.error=a.payload || 'Signup failed' })

    .addCase(fetchSession.fulfilled, (s,a)=>{ 
      if(a.payload){ 
        s.user = { 
          id: a.payload.user.id, 
          name: a.payload.user.name, 
          email: a.payload.user.email, 
          role: a.payload.user.role 
        }
        s.token=a.payload.token
        s.isAuthenticated=true 
      } 
    })

    .addCase(updateProfile.fulfilled, (s,a)=>{ 
      s.user = { ...s.user, ...a.payload } 
      toast.success('Profile updated') 
    })

    .addCase(changePassword.fulfilled, ()=>{ toast.success('Password changed') })
    .addCase(changePassword.rejected, (s,a)=>{ toast.error(a.payload || 'Password change failed') })
  }
})

export const { logout } = slice.actions
export const selectAuth = (state)=>state.auth
export default slice.reducer
