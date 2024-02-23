import React from 'react'
import { Outlet } from 'react-router-dom'

const Info_Index = () => {
  return (
    <div className="flex justify-center space-x-4">
    <a
      href="/info/privacy"
      className="block bg-white shadow-md rounded-lg p-6 max-w-sm hover:bg-gray-100"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Privacy Policy
      </h2>
      <p className="text-gray-600">
        Read our privacy policy to understand how we handle your data.
      </p>
    </a>

    <a
      href="/info/terms"
      className="block bg-white shadow-md rounded-lg p-6 max-w-sm hover:bg-gray-100"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Terms of Service
      </h2>
      <p className="text-gray-600">
        Review our terms of service to learn about the rules and
        regulations.
      </p>
    </a>
    <Outlet />
  </div>
  )
}

export default Info_Index