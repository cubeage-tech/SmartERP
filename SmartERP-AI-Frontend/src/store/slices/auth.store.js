import { create } from 'zustand'
import storageService from '../../core/services/storage.service'

const useAuthStore = create((set) => ({
  // Rehydrate from localStorage on load so a page refresh doesn't drop the session.
  user: storageService.getUser(),
  token: storageService.getToken(),
  isAuthenticated: !!storageService.getUser(),
  loading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  logout: () => {
    storageService.clearToken()
    storageService.clearUser()
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

export default useAuthStore
