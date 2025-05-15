import { useState } from 'react'
import { ArrowUpTrayIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/xml') {
      // TODO: Handle file upload
      console.log('File selected:', file)
    } else {
      // TODO: Show error toast
      console.log('Please upload an XML file')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === 'text/xml') {
      // TODO: Handle file upload
      console.log('File dropped:', file)
    } else {
      // TODO: Show error toast
      console.log('Please upload an XML file')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo/Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-12">SpendSmart</h1>

      {/* Upload Box */}
      <div
        className={`
          w-full max-w-md p-8 rounded-xl border-2 border-dashed
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          transition-colors duration-200 ease-in-out
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <ArrowUpTrayIcon className="w-12 h-12 text-gray-400" />
          <p className="text-center text-gray-600">
            Drop your exported SMS XML file here or click to upload
          </p>
          <label className="mt-2">
            <input
              type="file"
              accept=".xml"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
              click to upload
            </span>
          </label>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center my-8 w-full max-w-md">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Manual Entry Button */}
      <Link
        to="/manual-entry"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Manually
      </Link>

      {/* Help Text */}
      <p className="mt-8 text-sm text-gray-500">
        <Link to="/guide" className="text-blue-600 hover:text-blue-700">
          What's an SMS XML?
        </Link>
      </p>

      {/* Dashboard Link (if data exists) */}
      <Link
        to="/dashboard"
        className="fixed bottom-8 text-sm text-gray-500 hover:text-gray-700"
      >
        View Dashboard
      </Link>
    </div>
  )
}

export default LandingPage 