import { useMemo } from 'react';
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
import { PlusIcon } from '@heroicons/react/24/outline';
import useExpenseStore from '../store/expenseStore';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#34d399'];

export default function DashboardPage() {
  const expenses = useExpenseStore((state) => state.expenses);

  const { monthlyData, categoryData, totalSpent } = useMemo(() => {
    const now = new Date();
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return date.toISOString().slice(0, 7); // YYYY-MM format
    }).reverse();

    const monthlyData = lastSixMonths.map((month) => ({
      month: new Date(month).toLocaleDateString('default', { month: 'short' }),
      amount: expenses
        .filter((expense) => expense.date.startsWith(month))
        .reduce((sum, expense) => sum + expense.amount, 0),
    }));

    const categoryData = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    const pieData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
    }));

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return { monthlyData, categoryData: pieData, totalSpent };
  }, [expenses]);

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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-6 backdrop-blur-md">
            <dt className="text-sm font-medium text-gray-400">Total Spent</dt>
            <dd className="mt-2 text-3xl font-semibold text-indigo-300">${totalSpent.toFixed(2)}</dd>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-6 backdrop-blur-md">
            <dt className="text-sm font-medium text-gray-400">Total Expenses</dt>
            <dd className="mt-2 text-3xl font-semibold text-indigo-300">{expenses.length}</dd>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-6 backdrop-blur-md">
            <dt className="text-sm font-medium text-gray-400">Average Expense</dt>
            <dd className="mt-2 text-3xl font-semibold text-indigo-300">${(totalSpent / (expenses.length || 1)).toFixed(2)}</dd>
          </motion.div>
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