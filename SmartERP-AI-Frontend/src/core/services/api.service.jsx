import axios from '../../utils/axios'

const apiService = {
  get: (url, params) =>
    axios.get(url, { params }),

  post: (url, data) =>
    axios.post(url, data),

  put: (url, data) =>
    axios.put(url, data),

  patch: (url, data, config) =>
    axios.patch(url, data, config),

  delete: (url) =>
    axios.delete(url),
}

export default apiService