import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectProjects } from '../store/projectsSlice.js'
import { selectTasks, createTask, updateTask, deleteTask, updateTaskStatus, addComment, addAttachment } from '../store/tasksSlice.js'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const columns = ['Backlog', 'In Progress', 'Review', 'Done']

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  type: yup.string().oneOf(['Bug','Feature','Improvement']).required(),
  priority: yup.string().oneOf(['Low','Medium','High']).required(),
  dueDate: yup.date().nullable()
})

export default function ProjectDetail() {
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const { projects } = useSelector(selectProjects)
  const { tasks } = useSelector(selectTasks)

  const project = projects.find(p => String(p.id) === String(projectId))
  const projectTasks = tasks.filter(t => String(t.projectId) === String(project?.id))

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (editingTask) {
      const updated = tasks.find(t => String(t.id) === String(editingTask.id))
      if (updated) setEditingTask(updated)
    }
  }, [tasks])

  if (!project) return <p className="text-center text-gray-500">Project not found.</p>

  const openCreateModal = () => { setEditingTask(null); reset(); setModalOpen(true) }
  const openEditModal = (task) => {
    setEditingTask(task)
    reset({ ...task, dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '' })
    setModalOpen(true)
  }

  const onSubmit = (data) => {
    const taskData = { ...data, dueDate: data.dueDate ? new Date(data.dueDate).toString() : null }
    editingTask ? dispatch(updateTask({ id: editingTask.id, changes: taskData })) : dispatch(createTask({ projectId: project.id, ...taskData }))
    setModalOpen(false); reset()
  }

  const handleDelete = (id) => { if(confirm('Are you sure?')) dispatch(deleteTask(id)) }
  const handleAddComment = (taskId) => { const text = prompt('Enter comment:'); if(text) dispatch(addComment({ taskId, text })) }
  const handleAddAttachment = (taskId, e) => { const file = e.target.files[0]; if(file) dispatch(addAttachment({ taskId, file })); e.target.value=null }
  const onDragEnd = (result) => { if(!result.destination) return; dispatch(updateTaskStatus({ id: result.draggableId, status: result.destination.droppableId })) }
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : ''

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{project.name}</h2>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onClick={openCreateModal}>+ Task</button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] p-6 flex flex-col space-y-4 relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-800">{editingTask ? 'Edit Task' : 'Create Task'}</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)}>Close</button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-4">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-700">Title</label>
                  <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" {...register('title')} />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-700">Description</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={3} {...register('description')} />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-700">Type</label>
                  <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" {...register('type')}>
                    <option value="Feature">Feature</option>
                    <option value="Bug">Bug</option>
                    <option value="Improvement">Improvement</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-700">Priority</label>
                  <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" {...register('priority')}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-700">Due Date</label>
                  <input type="date" className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" {...register('dueDate')} />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">{editingTask ? 'Update Task' : 'Create Task'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid md:grid-cols-4 gap-4">
          {columns.map(col => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div className="bg-gray-100 rounded-lg p-3 min-h-[300px]" ref={provided.innerRef} {...provided.droppableProps}>
                  <h3 className="font-medium mb-2 text-gray-700">{col}</h3>
                  {projectTasks.filter(t => t.status === col).map((t, idx) => (
                    <Draggable draggableId={String(t.id)} index={idx} key={t.id}>
                      {(p) => (
                        <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="bg-white rounded-lg p-3 mb-2 shadow relative">
                          <p className="font-medium text-gray-800">{t.title}</p>
                          {t.description && <p className="text-xs text-gray-500">{t.description}</p>}
                          <p className="text-xs text-gray-400">Type: {t.type} • Priority: {t.priority}</p>
                          {t.dueDate && <p className="text-xs text-gray-400">Due: {formatDate(t.dueDate)}</p>}

                          {t.comments?.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              💬 {t.comments.length}
                              <ul className="list-disc pl-5">
                                {t.comments.slice(-2).map(c => <li key={c.id}>{c.text}</li>)}
                              </ul>
                            </div>
                          )}

                          {t.attachments?.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              📎 Attachments:
                              <ul className="list-disc pl-5">
                                {t.attachments.map(a => <li key={a.id}>{a.file.name}</li>)}
                              </ul>
                            </div>
                          )}

                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition text-xs"
                              onClick={() => openEditModal(t)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition text-xs"
                              onClick={() => handleDelete(t.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition text-xs"
                              onClick={() => handleAddComment(t.id)}
                            >
                              + Comment
                            </button>
                            <label className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition text-xs cursor-pointer">
                              + File
                              <input type="file" className="hidden" onChange={(e) => handleAddAttachment(t.id, e)} />
                            </label>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
