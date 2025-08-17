import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjects, createProject, updateProject, deleteProject } from '../store/projectsSlice.js'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().required('Description is required')
})

export default function ProjectsPage() {
  const { projects } = useSelector(selectProjects)
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const createForm = useForm({ resolver: yupResolver(schema) })
  const { register: regCreate, handleSubmit: handleCreate, reset: resetCreate, formState: { errors: createErrors } } = createForm

  const [editing, setEditing] = useState(null)
  const editForm = useForm({ resolver: yupResolver(schema), defaultValues: { name: '', description: '' } })
  const { register: regEdit, handleSubmit: handleEditSubmit, reset: resetEdit, formState: { errors: editErrors } } = editForm

  useEffect(() => {
    if (editing) resetEdit({ name: editing.name || '', description: editing.description || '' })
  }, [editing, resetEdit])

  const onCreate = (data) => { dispatch(createProject(data)); resetCreate(); setOpen(false) }
  const onEdit = (data) => { if(!editing) return; dispatch(updateProject({ id: editing.id, changes: data })); setEditing(null) }
  const handleDelete = (id, name) => { if(window.confirm(`Delete project "${name}"?`)) dispatch(deleteProject(id)) }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <button className="btn-primary" onClick={() => setOpen(true)}>New Project</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map(p => (
          <div key={p.id} className="card p-4 hover:shadow-md relative">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/projects/${p.id}`} className="text-lg font-medium hover:underline block">{p.name}</Link>
                <p className="text-sm opacity-80 line-clamp-2">{p.description}</p>
                <p className="text-xs mt-2 opacity-70">Owner: {p.ownerName || '—'} • {p.status}</p>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button className="btn-secondary text-sm px-3 py-1" onClick={() => setEditing(p)}>Edit</button>
                <button className="btn-secondary text-sm px-3 py-1" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-40">
          <div className="card max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Create Project</h3>
              <button className="btn-secondary" onClick={() => { setOpen(false); resetCreate() }}>Close</button>
            </div>
            <form className="space-y-4" onSubmit={handleCreate(onCreate)}>
              <div>
                <label className="label">Name</label>
                <input className="input" {...regCreate('name')} />
                {createErrors.name && <p className="text-red-600 text-sm">{createErrors.name.message}</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows="3" {...regCreate('description')} />
                {createErrors.description && <p className="text-red-600 text-sm">{createErrors.description.message}</p>}
              </div>
              <div className="flex justify-end">
                <button className="btn-primary" type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-50">
          <div className="card max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Edit Project</h3>
              <button className="btn-secondary" onClick={() => { setEditing(null); resetEdit() }}>Close</button>
            </div>
            <form className="space-y-4" onSubmit={handleEditSubmit(onEdit)}>
              <div>
                <label className="label">Name</label>
                <input className="input" {...regEdit('name')} />
                {editErrors.name && <p className="text-red-600 text-sm">{editErrors.name.message}</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows="3" {...regEdit('description')} />
                {editErrors.description && <p className="text-red-600 text-sm">{editErrors.description.message}</p>}
              </div>
              <div className="flex justify-between">
                <button type="button" className="btn-secondary" onClick={() => { setEditing(null); resetEdit() }}>Cancel</button>
                <button className="btn-primary" type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
