import { useMemo } from 'react';
import { motion } from 'framer-motion';
import useExpenseStore from '../store/expenseStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

export default function OverviewPage() {
  const expenses = useExpenseStore((state) => state.expenses);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    // Helper function to safely parse dates
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    };

    // Filter transactions with valid dates
    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = parseDate(expense.date);
      return expenseDate && expenseDate >= startOfMonth && expenseDate <= now;
    });

    const weeklyExpenses = expenses.filter((expense) => {
      const expenseDate = parseDate(expense.date);
      return expenseDate && expenseDate >= startOfWeek && expenseDate <= now;
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const weeklyTotal = weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate average daily spending
    const daysInMonth = now.getDate();
    const daysInWeek = 7;
    const dailyAverage = daysInMonth > 0 ? monthlyTotal / daysInMonth : 0;
    const weeklyAverage = daysInWeek > 0 ? weeklyTotal / daysInWeek : 0;

    // Calculate trends
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 14);

    const lastMonthExpenses = expenses.filter((expense) => {
      const expenseDate = parseDate(expense.date);
      return expenseDate && expenseDate >= lastMonth && expenseDate <= lastMonthEnd;
    });

    const lastWeekExpenses = expenses.filter((expense) => {
      const expenseDate = parseDate(expense.date);
      return expenseDate && expenseDate >= lastWeek && expenseDate <= startOfWeek;
    });

    const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const lastWeekTotal = lastWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const monthlyTrend = lastMonthTotal ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;
    const weeklyTrend = lastWeekTotal ? ((weeklyTotal - lastWeekTotal) / lastWeekTotal) * 100 : 0;

    return {
      totalExpenses,
      monthlyTotal,
      weeklyTotal,
      dailyAverage,
      weeklyAverage,
      monthlyTrend,
      weeklyTrend,
    };
  }, [expenses]);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/80 border border-gray-700 rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-white mt-1">${value.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-500/10 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-400" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          {trend > 0 ? (
            <ArrowTrendingUpIcon className="h-4 w-4 text-red-400" />
          ) : (
            <ArrowTrendingDownIcon className="h-4 w-4 text-green-400" />
          )}
          <span
            className={`text-sm ml-1 ${
              trend > 0 ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {Math.abs(trend).toFixed(1)}% from last period
          </span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          value={stats.totalExpenses}
          icon={CurrencyDollarIcon}
        />
        <StatCard
          title="Monthly Spending"
          value={stats.monthlyTotal}
          icon={ChartBarIcon}
          trend={stats.monthlyTrend}
        />
        <StatCard
          title="Daily Average"
          value={stats.dailyAverage}
          icon={ArrowTrendingUpIcon}
        />
        <StatCard
          title="Weekly Average"
          value={stats.weeklyAverage}
          icon={ArrowTrendingDownIcon}
          trend={stats.weeklyTrend}
        />
      </div>

      {/* Add more overview content here */}
    </div>
  );
} 