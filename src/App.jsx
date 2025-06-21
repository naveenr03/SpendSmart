import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import OverviewPage from './pages/OverviewPage'
import TransactionsPage from './pages/TransactionsPage'
import AddExpensePage from './pages/AddExpensePage'
import SmartBudgetPage from './pages/SmartBudgetPage'
import './App.css'
import Navbar from './components/Navbar'
import DashboardPage from './pages/DashboardPage'
import BudgetSettings from './components/BudgetSettings'
import { useEffect } from 'react'
import useBudgetStore from './store/budgetStore'

export default function App() {
  const resetMonthlySpending = useBudgetStore((state) => state.resetMonthlySpending)

  useEffect(() => {
    // Check if it's the first day of the month
    const checkAndResetBudgets = () => {
      const now = new Date()
      if (now.getDate() === 1) {
        resetMonthlySpending()
      }
    }

    // Check on mount
    checkAndResetBudgets()

    // Set up interval to check daily
    const interval = setInterval(checkAndResetBudgets, 24 * 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [resetMonthlySpending])

  return (
    <Router>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
        <Navbar />
        <Toaster position="top-right" />
        <main className="w-full px-2 sm:px-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/add-expense" element={<AddExpensePage />} />
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
            <Route
              path="/dashboard/budget"
              element={
                <Layout>
                  <BudgetSettings />
                </Layout>
              }
            />
            <Route
              path="/dashboard/smart-budget"
              element={
                <Layout>
                  <SmartBudgetPage />
                </Layout>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
