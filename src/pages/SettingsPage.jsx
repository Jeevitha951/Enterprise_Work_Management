import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { selectAuth, updateProfile, changePassword } from '../store/authSlice.js'

const profileSchema = yup.object({
  name: yup.string().required()
})

const pwdSchema = yup.object({
  current: yup.string().required(),
  next: yup.string().min(4).required()
})

export default function SettingsPage() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)

  const profForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: user?.name || '' }
  })

  const pwdForm = useForm({
    resolver: yupResolver(pwdSchema)
  })

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Settings</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4 space-y-4">
          <h3 className="font-medium text-lg">Profile</h3>
          <form className="space-y-3" onSubmit={profForm.handleSubmit(d => dispatch(updateProfile(d)))}>
            <div>
              <label className="label">Name</label>
              <input className="input" {...profForm.register('name')} />
              {profForm.formState.errors.name && (
                <p className="text-red-600 text-sm">{profForm.formState.errors.name.message}</p>
              )}
            </div>
            <button className="btn-primary w-full">Save</button>
          </form>
        </div>

        <div className="card p-4 space-y-4">
          <h3 className="font-medium text-lg">Change Password</h3>
          <form className="space-y-3" onSubmit={pwdForm.handleSubmit(d => dispatch(changePassword(d)))}>
            <div>
              <label className="label">Current Password</label>
              <input type="password" className="input" {...pwdForm.register('current')} />
            </div>
            <div>
              <label className="label">New Password</label>
              <input type="password" className="input" {...pwdForm.register('next')} />
              {pwdForm.formState.errors.next && (
                <p className="text-red-600 text-sm">{pwdForm.formState.errors.next.message}</p>
              )}
            </div>
            <button className="btn-primary w-full">Update</button>
          </form>
        </div>
      </div>
    </div>
  )
}
