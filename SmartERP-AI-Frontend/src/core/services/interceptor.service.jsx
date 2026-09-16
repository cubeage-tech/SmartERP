import storageService from './storage.service'

export const attachInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    const token = storageService.getToken()
    const user = storageService.getUser()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (user?.tenantId != null) {
      config.headers['X-Tenant-Id'] = user.tenantId
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  })

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        // console.error("401 UNAUTHORIZED:", error.config) // Log the request config for debugging
        // console.error("401 RESPONSE:", error.response?.data)
        storageService.clear()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  return axiosInstance
}