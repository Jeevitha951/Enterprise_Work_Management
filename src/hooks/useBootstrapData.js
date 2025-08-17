import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProjects } from '../store/projectsSlice.js'
import { fetchTasks } from '../store/tasksSlice.js'
import { fetchUsers } from '../store/usersSlice.js'

export default function useBootstrapData(){
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(fetchProjects())
    dispatch(fetchTasks())
    dispatch(fetchUsers())
  }, [dispatch])
}
