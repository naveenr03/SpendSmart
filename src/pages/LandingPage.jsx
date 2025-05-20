import { Link } from 'react-router-dom'
import { ArrowUpTrayIcon, PlusCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 sm:text-6xl md:text-7xl"
          >
            SpendSmart+
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-6 md:text-xl md:max-w-3xl"
          >
            Take control of your finances with our simple and intuitive expense tracker
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16"
        >
          {/* Drag and Drop Upload Box */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                <ArrowUpTrayIcon className="h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-200 mb-2">Upload SMS Data</h3>
                <p className="text-gray-400 text-center mb-6">
                  Drag and drop your SMS export file here, or click to browse
                </p>
                <button className="px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200 backdrop-blur-sm">
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto">
            <Link
              to="/add-expense"
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center justify-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200">
                <PlusCircleIcon className="h-6 w-6 text-indigo-400 mr-3" />
                <span className="text-gray-200 font-medium">Add New Expense</span>
              </div>
            </Link>

            <Link
              to="/dashboard"
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center justify-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200">
                <ChartBarIcon className="h-6 w-6 text-indigo-400 mr-3" />
                <span className="text-gray-200 font-medium">View Dashboard</span>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 