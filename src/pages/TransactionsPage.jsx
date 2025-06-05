import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useExpenseStore from '../store/expenseStore';
import { PlusIcon, FunnelIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function TransactionsPage() {
  const expenses = useExpenseStore((state) => state.expenses);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    category: 'all',
    minAmount: '',
    maxAmount: '',
  });
  const removeExpense = useExpenseStore((state) => state.removeExpense);
  const clearExpenses = useExpenseStore((state) => state.clearExpenses);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(expenses.map((expense) => expense.category));
    return Array.from(uniqueCategories);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      if (filters.category !== 'all' && expense.category !== filters.category) {
        return false;
      }

      if (filters.minAmount && expense.amount < parseFloat(filters.minAmount)) {
        return false;
      }

      if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount)) {
        return false;
      }

      if (filters.dateRange !== 'all') {
        const now = new Date();
        const expenseDate = new Date(expense.date);
        
        switch (filters.dateRange) {
          case 'today':
            return expenseDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return expenseDate >= weekAgo;
          case 'month':
            return expenseDate.getMonth() === now.getMonth() &&
                   expenseDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      }

      return true;
    });
  }, [expenses, filters]);

  const handleRemoveExpense = (id) => {
    try {
      removeExpense(id);
      toast.success('Transaction removed successfully');
    } catch (error) {
      console.error('Error removing transaction:', error);
      toast.error('Failed to remove transaction');
    }
  };

  const handleClearAll = () => {
    try {
      clearExpenses();
      setShowClearConfirm(false);
      toast.success('All transactions cleared successfully');
    } catch (error) {
      console.error('Error clearing transactions:', error);
      toast.error('Failed to clear transactions');
    }
  };

  const FilterSidebar = () => (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-medium text-white mb-4">Filters</h2>
      
      {/* Date Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Date Range
        </label>
        <select
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
          value={filters.dateRange}
          onChange={(e) =>
            setFilters({ ...filters, dateRange: e.target.value })
          }
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Category
        </label>
        <select
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Range Filters */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Amount Range
        </label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min Amount"
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
            value={filters.minAmount}
            onChange={(e) =>
              setFilters({ ...filters, minAmount: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max Amount"
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
            value={filters.maxAmount}
            onChange={(e) =>
              setFilters({ ...filters, maxAmount: e.target.value })
            }
          />
        </div>
      </div>

      {/* Clear All Button */}
      {expenses.length > 0 && (
        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <TrashIcon className="h-5 w-5" />
          <span>Clear All Transactions</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 lg:hidden"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </button>
          <Link to="/dashboard/add-expense" className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-500">
            <PlusIcon className="h-5 w-5" />
            Add Transaction
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar - Mobile */}
        <div className={`lg:hidden ${isFilterOpen ? 'block' : 'hidden'}`}>
          <FilterSidebar />
        </div>

        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-64">
          <FilterSidebar />
        </div>

        {/* Transactions List */}
        <div className="flex-1">
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredExpenses.map((expense) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-700"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-white">
                        {expense.description || expense.note || 'No description'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {expense.category}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleRemoveExpense(expense.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Remove transaction"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Clear All Transactions?
            </h3>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. All your transaction history will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 