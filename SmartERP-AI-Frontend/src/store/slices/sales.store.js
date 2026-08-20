import { create } from 'zustand'

const useSalesStore = create((set) => ({
  dashboard:   null,
  quotations:  [],
  orders:      [],
  invoices:    [], 
  analytics:   null,
  loading:     false,
  error:       null,

  setDashboard:  (dashboard)  => set({ dashboard }),
  setQuotations: (quotations) => set({ quotations }),
  setOrders:     (orders)     => set({ orders }),
  setInvoices:   (invoices)   => set({ invoices }),
  setAnalytics:  (analytics)  => set({ analytics }),
  setLoading:    (loading)    => set({ loading }),
  setError:      (error)      => set({ error }),
}))

export default useSalesStore
