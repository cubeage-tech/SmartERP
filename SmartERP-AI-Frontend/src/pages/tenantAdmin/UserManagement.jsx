import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'

import useAuthStore from '../../store/slices/auth.store'

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserStatus,
  getRoles,
} from '../../core/services/modules/userManagement.service.jsx'

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  roleId: '',
  position: '',
  active: true,
}

export default function UserManagement() {
  const { user: authUser } = useAuthStore()
  const tenantId = authUser?.tenantId

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [editingUser, setEditingUser] = useState(null)

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  // Password visibility
  const [showPassword, setShowPassword] = useState(false)

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  })

  const showToast = useCallback((message, type = 'success') => {
    setToast({
      show: true,
      message,
      type,
    })

    setTimeout(() => {
      setToast({
        show: false,
        message: '',
        type: 'success',
      })
    }, 3500)
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const [usersRes, rolesRes] = await Promise.all([
        getUsers(),
        getRoles(tenantId),
      ])

      setUsers(
        Array.isArray(usersRes.data)
          ? usersRes.data
          : []
      )

      setRoles(
        Array.isArray(rolesRes.data)
          ? rolesRes.data
          : []
      )
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          'Failed to load user management data',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }, [tenantId, showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setServerError('')
    setEditingUser(null)
    setShowPassword(false)
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Full name is required'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      nextErrors.email = 'Enter a valid email address'
    }

    // Password is required only while creating
    if (!editingUser) {
      if (!form.password) {
        nextErrors.password = 'Password is required'
      } else if (form.password.length < 8) {
        nextErrors.password =
          'Password must contain at least 8 characters'
      }
    }

    if (!form.roleId) {
      nextErrors.roleId = 'Please select a role'
    }

    if (!form.position.trim()) {
      nextErrors.position =
        'Position / Job Title is required'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setServerError('')

    try {
      if (editingUser) {
        const response = await updateUser(
          editingUser.id,
          {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            roleId: Number(form.roleId),
            position: form.position.trim(),
            active: Boolean(form.active),
          }
        )

        const updatedUser = response.data

        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingUser.id
              ? updatedUser
              : user
          )
        )

        showToast(
          `User "${form.name}" updated successfully!`
        )
      } else {
        const response = await createUser({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          roleId: Number(form.roleId),
          position: form.position.trim(),
          active: true,
        })

        if (response.data) {
          setUsers((prev) => [
            response.data,
            ...prev,
          ])
        } else {
          await fetchData()
        }

        showToast(
          `User "${form.name}" created successfully!`
        )
      }

      resetForm()
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Something went wrong. Please try again.'

      setServerError(message)
    } finally {
      setSubmitting(false)
    }
  }

    const handleEdit = (user) => {
      const firstRole = Array.isArray(user.roles)
        ? user.roles[0]
        : user.roles
    
      const matchedRole = roles.find(
        (role) =>
          String(role.name).trim().toUpperCase() ===
          String(firstRole).trim().toUpperCase()
      )
  
      setEditingUser(user)
  
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        roleId: matchedRole ? String(matchedRole.id) : '',
        position: user.position || '',
        active: Boolean(user.active),
      })

  setErrors({})
  setServerError('')
  setShowPassword(false)

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    if (deletingId) {
      return
    }

    setDeletingId(user.id)

    try {
      await deleteUser(user.id)

      setUsers((prev) =>
        prev.filter(
          (item) => item.id !== user.id
        )
      )

      if (editingUser?.id === user.id) {
        resetForm()
      }

      showToast(
        `User "${user.name}" deleted successfully!`
      )
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          'Failed to delete user',
        'error'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleStatus = async (user) => {
    if (togglingId) {
      return
    }

    const newStatus = !user.active

    setTogglingId(user.id)

    try {
      const response = await changeUserStatus(
        user.id,
        newStatus
      )

      const updatedUser = response.data

      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? updatedUser || {
                ...item,
                active: newStatus,
              }
            : item
        )
      )

      if (editingUser?.id === user.id) {
        setForm((prev) => ({
          ...prev,
          active: newStatus,
        }))
      }

      showToast(
        `User "${user.name}" is now ${
          newStatus ? 'Active' : 'Inactive'
        }`
      )
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          'Failed to change user status',
        'error'
      )
    } finally {
      setTogglingId(null)
    }
  }

  const getRoleName = (role) => {
    if (!role) {
      return ''
    }

    if (typeof role === 'object') {
      return (
        role.name ||
        role.roleName ||
        role.code ||
        ''
      )
    }

    return String(role)
  }

  const displayRoles = (userRoles) => {
    if (!userRoles) {
      return 'No Role'
    }

    const arr = Array.isArray(userRoles)
      ? userRoles
      : [userRoles]

    if (!arr.length) {
      return 'No Role'
    }

    return arr
      .map((role) =>
        getRoleName(role)
          .replace(/^ROLE_/i, '')
          .replace(/_/g, ' ')
      )
      .join(', ')
  }

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()

    return users.filter((user) => {
      const nameMatch = (
        user.name || ''
      )
        .toLowerCase()
        .includes(q)

      const emailMatch = (
        user.email || ''
      )
        .toLowerCase()
        .includes(q)

      const positionMatch = (
        user.position || ''
      )
        .toLowerCase()
        .includes(q)

      const matchesSearch =
        !q ||
        nameMatch ||
        emailMatch ||
        positionMatch

      const matchesRole =
        roleFilter === 'ALL' ||
        getRoleName(
          Array.isArray(user.roles)
            ? user.roles[0]
            : user.roles
        )
          .toUpperCase()
          .includes(roleFilter)

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' &&
          user.active) ||
        (statusFilter === 'INACTIVE' &&
          !user.active)

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      )
    })
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ])

  return (
    <div className="min-h-full bg-white px-4 py-3 sm:px-5">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed right-5 top-5 z-[100] flex items-center gap-2 rounded-[4px] px-4 py-3 text-[12px] shadow-lg ${
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-[#171717] text-white'
          }`}
        >
          <span className="text-[14px]">
            {toast.type === 'error'
              ? '⚠'
              : '✓'}
          </span>

          <span>{toast.message}</span>
        </div>
      )}

      <div className="w-full">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h1 className="text-[22px] font-semibold leading-[26px] tracking-[-0.02em] text-[#111]">
              User Management
            </h1>

            <p className="mt-1 text-[13px] leading-[18px] text-[#444]">
              Create, manage and assign roles to users. Users can login with their email and password.
            </p>
          </div>

          <div className="hidden items-center gap-3 pt-1 text-[12px] text-[#555] sm:flex">
            <span>Home</span>
            <span className="text-[#999]">›</span>
            <span>User Management</span>
          </div>
        </div>

        {/* Add / Edit User */}
        <section className="rounded-[3px] border border-[#d5d5d5] bg-white px-3 py-2.5">
          <div className="mb-3">
            <h2 className="text-[16px] font-semibold text-[#222]">
              {editingUser
                ? 'Edit User'
                : 'Add New User'}
            </h2>
          </div>

          {serverError && (
            <div className="mb-3 rounded-[3px] border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-2.5 md:grid-cols-3">

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#222]">
                  Role
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  value={form.roleId}
                  onChange={(e) =>
                    handleChange(
                      'roleId',
                      e.target.value
                    )
                  }
                  className={`h-[30px] w-full rounded-[3px] border bg-white px-2 text-[13px] text-[#333] outline-none ${
                    errors.roleId
                      ? 'border-red-400'
                      : 'border-[#cfcfcf]'
                  } focus:border-[#777]`}
                >
                  <option value="">
                    Select Role
                  </option>

                  {roles.map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                    >
                      {role.name}
                    </option>
                  ))}
                </select>

                {errors.roleId && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.roleId}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#222]">
                  Full Name
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    handleChange(
                      'name',
                      e.target.value
                    )
                  }
                  placeholder="Enter full name"
                  className={`h-[30px] w-full rounded-[3px] border bg-white px-2 text-[13px] text-[#333] outline-none ${
                    errors.name
                      ? 'border-red-400'
                      : 'border-[#cfcfcf]'
                  } focus:border-[#777]`}
                />

                {errors.name && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#222]">
                  Email
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    handleChange(
                      'email',
                      e.target.value
                    )
                  }
                  placeholder="Enter email address"
                  className={`h-[30px] w-full rounded-[3px] border bg-white px-2 text-[13px] text-[#333] outline-none ${
                    errors.email
                      ? 'border-red-400'
                      : 'border-[#cfcfcf]'
                  } focus:border-[#777]`}
                />

                {errors.email && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#222]">
                  Password
                  {!editingUser && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={form.password}
                    onChange={(e) =>
                      handleChange(
                        'password',
                        e.target.value
                      )
                    }
                    placeholder={
                      editingUser
                        ? 'Leave blank to keep current password'
                        : 'Enter password'
                    }
                    className={`h-[30px] w-full rounded-[3px] border bg-white px-2 pr-9 text-[13px] text-[#333] outline-none ${
                      errors.password
                        ? 'border-red-400'
                        : 'border-[#cfcfcf]'
                    } focus:border-[#777]`}
                  />

                  {/* Password Eye */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-0 top-0 flex h-[30px] w-[30px] items-center justify-center text-[#555] transition-colors hover:text-[#111]"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    title={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                        <circle
                          cx="12"
                          cy="12"
                          r="2.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-3.2 4.1" />
                        <path d="M6.2 6.2C3.6 8.1 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.2-1" />
                      </svg>
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#222]">
                  Position
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  value={form.position}
                  onChange={(e) =>
                    handleChange(
                      'position',
                      e.target.value
                    )
                  }
                  placeholder="Enter position"
                  className={`h-[30px] w-full rounded-[3px] border bg-white px-2 text-[13px] text-[#333] outline-none ${
                    errors.position
                      ? 'border-red-400'
                      : 'border-[#cfcfcf]'
                  } focus:border-[#777]`}
                />

                {errors.position && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.position}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#222]">
                  Status
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  value={
                    form.active
                      ? 'ACTIVE'
                      : 'INACTIVE'
                  }
                  onChange={(e) =>
                    handleChange(
                      'active',
                      e.target.value ===
                        'ACTIVE'
                    )
                  }
                  className="h-[30px] w-full rounded-[3px] border border-[#cfcfcf] bg-white px-2 text-[13px] text-[#333] outline-none focus:border-[#777]"
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-3 flex justify-end gap-2">
              {editingUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="h-[29px] rounded-[3px] border border-[#888] bg-white px-5 text-[11px] font-medium text-[#222] hover:bg-[#f5f5f5] disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

              {!editingUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="h-[29px] rounded-[3px] border border-[#888] bg-white px-5 text-[11px] font-medium text-[#222] hover:bg-[#f5f5f5] disabled:opacity-50"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-[29px] items-center gap-2 rounded-[3px] bg-[#050505] px-4 text-[11px] font-medium text-white hover:bg-[#252525] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-[17px] leading-none">
                  +
                </span>

                {submitting
                  ? editingUser
                    ? 'Updating...'
                    : 'Adding...'
                  : editingUser
                    ? 'Update User'
                    : 'Add User'}
              </button>
            </div>
          </form>
        </section>

        {/* User List */}
        <section className="mt-3 rounded-[3px] border border-[#d5d5d5] bg-white px-3 py-2.5">
          {/* User List Header */}
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[16px] font-semibold text-[#222]">
              User List
            </h2>

            <div className="flex gap-2">
              {/* Search */}
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-[7px] text-[#555]">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="6.5"
                    />
                    <path d="m16 16 4 4" />
                  </svg>
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search users..."
                  className="h-[28px] w-[153px] rounded-[3px] border border-[#d1d1d1] pl-7 pr-2 text-[10px] outline-none focus:border-[#777]"
                />
              </div>

              {/* Role */}
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="h-[28px] w-[118px] rounded-[3px] border border-[#d1d1d1] bg-white px-2 text-[10px] outline-none focus:border-[#777]"
              >
                <option value="ALL">
                  All Roles
                </option>

                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={String(
                      role.name
                    ).toUpperCase()}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="bg-[#eeeeee]">
                  <th className="w-[42px] px-3 py-[5px] text-[12px] font-semibold text-[#222]">
                    #
                  </th>

                  <th className="px-3 py-[5px] text-[12px] font-semibold text-[#222]">
                    User Name
                  </th>

                  <th className="px-3 py-[5px] text-[12px] font-semibold text-[#222]">
                    Email
                  </th>

                  <th className="px-3 py-[5px] text-[12px] font-semibold text-[#222]">
                    Role
                  </th>

                  <th className="px-3 py-[5px] text-[12px] font-semibold text-[#222]">
                    Position
                  </th>

                  <th className="px-3 py-[5px] text-[12px] font-semibold text-[#222]">
                    Status
                  </th>

                  <th className="w-[82px] px-3 py-[5px] text-[12px] font-semibold text-[#222]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-3 py-10 text-center text-[11px] text-[#666]"
                    >
                      <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-[#222] border-t-transparent" />
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-3 py-10 text-center text-[11px] text-[#777]"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(
                    (user, index) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#e5e5e5] last:border-b-0 hover:bg-[#fafafa]"
                      >
                        {/* # */}
                        <td className="px-3 py-[6px] text-[12px] text-[#222]">
                          {index + 1}
                        </td>

                        {/* User Name */}
                        <td className="px-3 py-[6px] text-[12px] font-medium text-[#222]">
                          {user.name || '—'}
                        </td>

                        {/* Email */}
                        <td className="px-3 py-[6px] text-[12px] text-[#333]">
                          {user.email || '—'}
                        </td>

                        {/* Role */}
                        <td className="px-3 py-[6px] text-[12px] text-[#333]">
                          {displayRoles(
                            user.roles
                          )}
                        </td>

                        {/* Position */}
                        <td className="px-3 py-[6px] text-[12px] text-[#333]">
                          {user.position || '—'}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-[6px]">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(
                                user
                              )
                            }
                            disabled={
                              togglingId ===
                              user.id
                            }
                            className="inline-flex items-center gap-1.5 text-[12px] disabled:opacity-50"
                            title="Click to change status"
                          >
                            <span
                              className={`h-[8px] w-[8px] rounded-full ${
                                user.active
                                  ? 'bg-black'
                                  : 'bg-[#a7a7a7]'
                              }`}
                            />

                            <span className="text-[#222]">
                              {togglingId ===
                              user.id
                                ? 'Updating...'
                                : user.active
                                  ? 'Active'
                                  : 'Inactive'}
                            </span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-[6px]">
                          <div className="flex items-center gap-1.5">
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  user
                                )
                              }
                              className="flex h-[23px] w-[23px] items-center justify-center rounded-[3px] border border-[#bdbdbd] bg-white text-[#333] hover:bg-[#f0f0f0]"
                              title="Edit user"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
                                <path d="m14.5 7.5 2 2" />
                              </svg>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  user
                                )
                              }
                              disabled={
                                deletingId ===
                                user.id
                              }
                              className="flex h-[23px] w-[23px] items-center justify-center rounded-[3px] border border-[#bdbdbd] bg-white text-[#333] hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Delete user"
                            >
                              {deletingId ===
                              user.id ? (
                                <span className="h-3 w-3 animate-spin rounded-full border border-[#555] border-t-transparent" />
                              ) : (
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M4 7h16" />
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M6 7l1 13h10l1-13" />
                                  <path d="M9 7l1-3h4l1 3" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-2 flex items-center justify-between text-[12px] text-[#333]">
            <span>
              Showing {filteredUsers.length} of{' '}
              {users.length} users
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="flex h-[24px] w-[24px] items-center justify-center rounded-[3px] border border-[#ddd] bg-white text-[#aaa]"
              >
                ‹
              </button>

              <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[3px] bg-black text-[10px] text-white">
                1
              </span>

              <button
                type="button"
                disabled
                className="flex h-[24px] w-[24px] items-center justify-center rounded-[3px] border border-[#ddd] bg-white text-[#333]"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}