import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PlusIcon, ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import useExpenseStore from '../store/expenseStore';
import useBudgetStore from '../store/budgetStore';
import { getBudgetStatus } from '../utils/budgetSuggestions';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#34d399'];

export default function DashboardPage() {
  const expenses = useExpenseStore((state) => state.expenses);
  const budgets = useBudgetStore((state) => state.budgets);
  const [budgetWarnings, setBudgetWarnings] = useState([]);

  useEffect(() => {
    // Check for budget warnings
    const warnings = [];
    Object.entries(budgets).forEach(([category, budget]) => {
      const status = getBudgetStatus(budget.spent, budget.limit);
      if (status.status === 'exceeded' || status.status === 'warning') {
        warnings.push({
          category,
          ...status,
        });
      }
    });

    setBudgetWarnings(warnings);

    // Show toast for new warnings
    warnings.forEach((warning) => {
      if (warning.status === 'exceeded') {
        toast.error(`${warning.category} budget exceeded!`);
      } else if (warning.status === 'warning') {
        toast.warning(`${warning.category} budget is close to limit`);
      }
    });
  }, [budgets]);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
         <Link to="/"> <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Expense Tracker</h1></Link >
          <Link
            to="/add-expense"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:from-indigo-400 hover:to-purple-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Expense
          </Link>
        </div>

        {/* Budget Warnings */}
        {budgetWarnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
              Budget Alerts
            </h2>
            <div className="space-y-4">
              {budgetWarnings.map((warning) => (
                <div
                  key={warning.category}
                  className={`p-4 rounded-lg ${
                    warning.status === 'exceeded'
                      ? 'bg-red-900/50 border border-red-500'
                      : 'bg-yellow-900/50 border border-yellow-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">{warning.category}</h3>
                    <span
                      className={`text-sm ${
                        warning.status === 'exceeded'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {warning.message}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Spent: ₹{budgets[warning.category].spent}</span>
                      <span>Limit: ₹{budgets[warning.category].limit}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          warning.status === 'exceeded'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            (budgets[warning.category].spent /
                              budgets[warning.category].limit) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Total Expenses
            </h3>
            <p className="text-3xl font-bold text-white">₹{totalExpenses}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Active Budgets
            </h3>
            <p className="text-3xl font-bold text-white">
              {Object.keys(budgets).length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Categories
            </h3>
            <p className="text-3xl font-bold text-white">
              {Object.keys(expensesByCategory).length}
            </p>
          </motion.div>
        </div>

        {/* Budget Progress */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6 text-indigo-500" />
            Budget Progress
          </h2>
          <div className="space-y-4">
            {Object.entries(budgets).map(([category, budget]) => {
              const status = getBudgetStatus(budget.spent, budget.limit);
              return (
                <div key={category} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{category}</h3>
                    <span
                      className={`text-sm ${
                        status.status === 'exceeded'
                          ? 'text-red-400'
                          : status.status === 'warning'
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {status.message}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Spent:</span>
                      <span className="text-white">₹{budget.spent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Limit:</span>
                      <span className="text-white">₹{budget.limit}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          status.status === 'exceeded'
                            ? 'bg-red-500'
                            : status.status === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            (budget.spent / budget.limit) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Monthly Expenses Chart */}
          <motion.div whileHover={{ scale: 1.01 }} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-medium text-gray-200 mb-4">Monthly Expenses</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#a5b4fc" />
                  <YAxis stroke="#a5b4fc" />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#a5b4fc' }} />
                  <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Distribution Chart */}
          <motion.div whileHover={{ scale: 1.01 }} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-medium text-gray-200 mb-4">Expense Categories</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#6366f1"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#a5b4fc' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 