import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
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
  Legend,
} from 'recharts';
import { PlusIcon } from '@heroicons/react/24/outline';
import useExpenseStore from '../store/expenseStore';
import useBudgetStore from '../store/budgetStore';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#34d399'];

function getCategoryEmoji(category) {
  // Optionally map categories to emojis
  const map = {
    'Food & Dining': '🍽️',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Bills & Utilities': '💡',
    'Health & Medical': '💊',
    'Travel': '✈️',
    'Education': '📚',
    'Personal Care': '🧴',
    'Other': '💸',
  };
  return map[category] || '';
}

export default function DashboardPage() {
  const expenses = useExpenseStore((state) => state.expenses);
  const budgets = useBudgetStore((state) => state.budgets);

  // --- Data Preparation ---
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Helper: parse date
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // --- Pie Chart Data ---
  const thisMonthCategory = {};
  const lastMonthCategory = {};
  let thisMonthTotal = 0;
  let lastMonthTotal = 0;
  expenses.forEach((expense) => {
    const d = parseDate(expense.date);
    if (!d) return;
    if (d >= startOfMonth && d <= now) {
      thisMonthCategory[expense.category] = (thisMonthCategory[expense.category] || 0) + expense.amount;
      thisMonthTotal += expense.amount;
    } else if (d >= startOfLastMonth && d <= endOfLastMonth) {
      lastMonthCategory[expense.category] = (lastMonthCategory[expense.category] || 0) + expense.amount;
      lastMonthTotal += expense.amount;
    }
  });
  const thisMonthPie = Object.entries(thisMonthCategory).map(([name, value]) => ({ name, value }));
  const lastMonthPie = Object.entries(lastMonthCategory).map(([name, value]) => ({ name, value }));

  // --- Monthly Gains/Losses ---
  const monthlyChange = lastMonthTotal ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;
  const monthlyChangeAbs = thisMonthTotal - lastMonthTotal;

  // --- Line Chart: Cumulative Balance ---
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
  let runningTotal = 0;
  const balanceLineData = sortedExpenses.map((expense) => {
    runningTotal += expense.amount;
    return {
      date: expense.date,
      balance: runningTotal,
    };
  });

  // --- Bar Chart: Last 7 Days ---
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    last7Days.push(d);
  }
  const last7BarData = last7Days.map((d, idx) => {
    const dayStr = d.toISOString().slice(0, 10);
    const total = expenses
      .filter((e) => {
        const ed = parseDate(e.date);
        return ed && ed.toISOString().slice(0, 10) === dayStr;
      })
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      amount: total,
    };
  });
  // Color bars red/green based on up/down vs previous day
  last7BarData.forEach((d, i) => {
    if (i === 0) d.trend = 0;
    else d.trend = d.amount - last7BarData[i - 1].amount;
  });

  // --- Budgets Panel Data ---
  const budgetList = Object.entries(budgets);

  // --- Total Balance ---
  const totalBalance = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-400 mb-1">Total Balance</h3>
              <p className="text-4xl font-bold text-white mb-2">₹{totalBalance.toLocaleString()}</p>
            </div>
            <div className="mt-4">
              <h4 className="text-sm text-gray-400 mb-1">This Month vs Last Month</h4>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${monthlyChangeAbs >= 0 ? 'text-green-400' : 'text-red-400'}`}>{monthlyChangeAbs >= 0 ? '+' : ''}₹{monthlyChangeAbs.toLocaleString()}</span>
                <span className={`text-sm font-semibold ${monthlyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
          {/* Pie Charts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-6 col-span-2 flex flex-col lg:flex-row gap-6 justify-between">
            <div className="flex-1 flex flex-col items-center">
              <h4 className="text-sm text-gray-400 mb-2">This Month</h4>
              <div className="h-40 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={thisMonthPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                      {thisMonthPie.map((entry, idx) => (
                        <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <h4 className="text-sm text-gray-400 mb-2">Last Month</h4>
              <div className="h-40 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={lastMonthPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                      {lastMonthPie.map((entry, idx) => (
                        <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mid Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart: Balance */}
          <motion.div whileHover={{ scale: 1.01 }} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-medium text-gray-200 mb-4">Balance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceLineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#a5b4fc" tickFormatter={(d) => d && d.slice(5)} />
                  <YAxis stroke="#a5b4fc" />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#a5b4fc' }} formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#a5b4fc' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          {/* Bar Chart: Last 7 Days */}
          <motion.div whileHover={{ scale: 1.01 }} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-medium text-gray-200 mb-4">Last 7 Days</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7BarData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#a5b4fc" />
                  <YAxis stroke="#a5b4fc" />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#a5b4fc' }} formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {last7BarData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.trend >= 0 ? '#34d399' : '#f472b6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Budgets Panel */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Budgets</h2>
          <div className="flex overflow-x-auto gap-4 pb-2 lg:grid lg:grid-cols-3 lg:gap-6">
            {budgetList.length === 0 && (
              <div className="text-gray-400">No active budgets. Set up a budget to get started!</div>
            )}
            {budgetList.map(([category, budget], idx) => {
              const percent = budget.limit ? Math.min((budget.spent / budget.limit) * 100, 100) : 0;
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="min-w-[220px] bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-5 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getCategoryEmoji(category)}</span>
                    <span className="text-white font-semibold text-lg">{category}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Spent</span>
                    <span>₹{budget.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Limit</span>
                    <span>₹{budget.limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{percent.toFixed(0)}% used</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 