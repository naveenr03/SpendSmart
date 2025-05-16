import { useState } from 'react'
import { ArrowUpTrayIcon, PlusIcon, ChartBarIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
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
    <div className="h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="absolute top-0 right-0 p-6 flex items-center space-x-6">
        <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
          <ChartBarIcon className="h-6 w-6" />
        </Link>
        <Link to="/guide" className="text-gray-600 hover:text-gray-900">
          <QuestionMarkCircleIcon className="h-6 w-6" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900">SpendSmart</h1>
          <p className="mt-4 text-gray-600 text-lg">Track and analyze your expenses effortlessly</p>
        </div>

        <div className="w-full max-w-xl">
          {/* Upload Box */}
          <div
            className={`
              p-16 rounded-2xl border-2 border-dashed
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              transition-colors duration-200 ease-in-out
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="p-4 rounded-full bg-gray-50">
                <ArrowUpTrayIcon className="w-12 h-12 text-gray-400" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-gray-900 text-lg font-medium">
                  Drop your exported SMS XML file here
                </p>
                <p className="text-gray-500 text-sm">
                  or
                </p>
                <label>
                  <input
                    type="file"
                    accept=".xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium">
                    click to browse
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Manual Entry Button */}
          <div className="mt-8 text-center">
            <Link
              to="/manual-entry"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Expense Manually
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-center text-sm text-gray-500">
            <Link to="/guide" className="text-blue-600 hover:text-blue-700">
              What's an SMS XML?
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage 