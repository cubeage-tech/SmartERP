import { useEffect, useState } from 'react'
import CompanyManagementService from '../services/modules/companyManagement.service'

const useActiveCompany = (preferredCompanyId) => {
  const [companyId, setCompanyId] = useState(preferredCompanyId || null)
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (preferredCompanyId) {
      setCompanyId(preferredCompanyId)
      return
    }
    let active = true
    CompanyManagementService.getAll()
      .then(({ data }) => {
        if (active) setCompanyId(data[0]?.id ?? null)
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.detail || 'Unable to load companies.')
      })
    return () => { active = false }
  }, [preferredCompanyId])

  useEffect(() => {
    if (!companyId || preferredCompanyId) return
    let active = true
    CompanyManagementService.getDashboard(companyId)
      .then(({ data }) => {
        if (active) {
          setDashboard(data)
          setError('')
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.detail || 'Unable to load the company dashboard.')
      })
    return () => { active = false }
  }, [companyId, preferredCompanyId])

  return { companyId, dashboard, company: dashboard?.company, error }
}

export default useActiveCompany
