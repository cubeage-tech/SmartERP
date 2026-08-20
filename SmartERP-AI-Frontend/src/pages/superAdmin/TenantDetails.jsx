import React from 'react'
import { useParams } from 'react-router-dom'

const TenantDetails = () => {
  const { id } = useParams()
  return (
    <div>
      <h1 className="text-2xl font-semibold">Tenant Details</h1>
      <p className="mt-2 text-gray-500">Details for tenant ID: {id}</p>
    </div>
  )
}

export default TenantDetails
