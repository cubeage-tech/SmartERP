import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrumbs = () => {
  const { pathname } = useLocation()

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg, index, arr) => ({
      label: seg
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      to: '/' + arr.slice(0, index + 1).join('/'),
    }))

  if (segments.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-6 py-2 text-sm text-gray-500 border-b border-gray-100 bg-gray-50"
    >
      <ol className="flex items-center gap-1 flex-wrap">
        <li>
          <Link to="/" className="hover:text-indigo-600">Home</Link>
        </li>
        {segments.map((seg, i) => (
          <React.Fragment key={seg.to}>
            <li className="select-none">/</li>
            <li>
              {i === segments.length - 1 ? (
                <span className="text-gray-800 font-medium">{seg.label}</span>
              ) : (
                <Link to={seg.to} className="hover:text-indigo-600">{seg.label}</Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
