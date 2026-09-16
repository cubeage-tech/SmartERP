import api from '../api.service.jsx'

// Fetch all users
export const getUsers = () =>
  api.get('/admin/users')

// Create a new user
export const createUser = (data) =>
  api.post('/admin/users', data)

// Update an existing user
export const updateUser = (id, data) =>
  api.put(`/admin/users/${id}`, data)

// Delete an existing user
export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`)

// Activate or deactivate a user
export const changeUserStatus = (id, active) =>
  api.patch(`/admin/users/${id}/status`, null, {
    params: { active },
  })

// Fetch all roles
export const getRoles = (tenantId) =>
  api.get('/admin/roles', tenantId ? { tenantId } : {})