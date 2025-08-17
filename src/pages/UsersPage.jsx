import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUsers, createUser, deleteUser, toggleUserStatus } from '../store/usersSlice.js'

export default function UsersPage() {
  const { users = [], currentUser = {} } = useSelector(selectUsers) || {}
  const dispatch = useDispatch()

  const addUser = () => {
    if (currentUser?.role !== "Admin") {
      alert("Only Admins can add users")
      return
    }
    const name = prompt('Enter Name')
    const email = prompt('Enter Email')
    const role = prompt('Enter Role (Admin/Manager/Employee)') || 'Employee'
    if (name && email) {
      dispatch(createUser({ name, email, role }))
    } else {
      alert("Name and Email are required")
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Users</h2>
        {currentUser?.role === "Admin" && (
          <button className="btn-primary" onClick={addUser}>New User</button>
        )}
      </div>

      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50 dark:bg-gray-800">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Last Activity</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(u => (
                <tr key={u.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.lastActive ? new Date(u.lastActive).toLocaleString() : '-'}</td>
                  <td className="p-3 flex items-center gap-2">
                    {u.status || '-'}
                    {currentUser?.role === "Admin" && (
                      <button 
                        className="btn-secondary text-xs"
                        onClick={() => dispatch(toggleUserStatus(u.id))}
                      >
                        Toggle
                      </button>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {currentUser?.role === "Admin" && (
                      <button 
                        className="btn-secondary text-xs"
                        onClick={() => dispatch(deleteUser(u.id))}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
