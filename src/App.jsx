import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import OverviewPage from './pages/OverviewPage'
import TransactionsPage from './pages/TransactionsPage'
import AddExpensePage from './pages/AddExpensePage'
import './App.css'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Toaster position="top-right" />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <OverviewPage />
                </Layout>
              }
            />
            <Route
              path="/dashboard/transactions"
              element={
                <Layout>
                  <TransactionsPage />
                </Layout>
              }
            />
            <Route
              path="/dashboard/add-expense"
              element={
                <Layout>
                  <AddExpensePage />
                </Layout>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
