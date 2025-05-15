import { useState } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Spendsmart</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Upload your SMS export file to start tracking and analyzing your expenses
        </p>
      </div>

      <div
        className={`
          w-full max-w-xl p-8 rounded-xl border-2 border-dashed
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          transition-colors duration-200 ease-in-out
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <ArrowUpTrayIcon className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              Drag and drop your XML file here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse files
            </p>
          </div>
          <label className="mt-4">
            <input
              type="file"
              accept=".xml"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
              Select File
            </span>
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Supported format: XML files exported from SMS Organizer
      </p>
    </div>
  )
}

export default LandingPage 