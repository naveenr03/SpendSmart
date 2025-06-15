import { motion } from 'framer-motion'
import XmlUploader from '../components/XmlUploader'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 w-full pt-16">
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