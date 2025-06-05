import { Link } from 'react-router-dom'
import { PlusCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import XmlUploader from '../components/XmlUploader'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              SpendSmart
            </h1>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
            Welcome to SpendSmart
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload your SMS XML file to analyze your spending patterns and get insights
            into your financial habits.
          </p>
        </motion.div>

        <XmlUploader />
      </div>
    </div>
  )
} 