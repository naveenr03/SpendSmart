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

export default function OverviewPage() {
  const expenses = useExpenseStore((state) => state.expenses);

  const { currentMonthSpending, lastMonthSpending, monthlyData } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .slice(0, 7);

    const currentMonthSpending = expenses
      .filter((expense) => expense.date.startsWith(currentMonth))
      .reduce((sum, expense) => sum + expense.amount, 0);

    const lastMonthSpending = expenses
      .filter((expense) => expense.date.startsWith(lastMonth))
      .reduce((sum, expense) => sum + expense.amount, 0);

    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return date.toISOString().slice(0, 7);
    }).reverse();

    const monthlyData = lastSixMonths.map((month) => ({
      month: new Date(month).toLocaleDateString('default', { month: 'short' }),
      amount: expenses
        .filter((expense) => expense.date.startsWith(month))
        .reduce((sum, expense) => sum + expense.amount, 0),
    }));

    return { currentMonthSpending, lastMonthSpending, monthlyData };
  }, [expenses]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Current Month Spending */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-gray-400 text-sm font-medium">Current Month</h3>
          <p className="text-3xl font-bold text-white mt-2">
            ${currentMonthSpending.toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {new Date().toLocaleDateString('default', { month: 'long' })}
          </p>
        </motion.div>

        {/* Last Month Spending */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-gray-400 text-sm font-medium">Last Month</h3>
          <p className="text-3xl font-bold text-white mt-2">
            ${lastMonthSpending.toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString(
              'default',
              { month: 'long' }
            )}
          </p>
        </motion.div>

        {/* Monthly Budget */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-gray-400 text-sm font-medium">Monthly Budget</h3>
          <p className="text-3xl font-bold text-white mt-2">$2,000.00</p>
          <p className="text-gray-400 text-sm mt-2">
            Remaining: ${(2000 - currentMonthSpending).toFixed(2)}
          </p>
        </motion.div>
      </div>

      {/* Monthly Spending Chart */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-lg font-medium text-white mb-4">Monthly Spending</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#a5b4fc" />
              <YAxis stroke="#a5b4fc" />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: 'none',
                  color: '#a5b4fc',
                }}
              />
              <Bar
                dataKey="amount"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
} 