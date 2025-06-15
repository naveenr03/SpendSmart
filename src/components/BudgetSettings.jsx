import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useBudgetStore from '../store/budgetStore';
import { generateBudgetSuggestions } from '../utils/budgetSuggestions';
import { PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Medical',
  'Travel',
  'Education',
  'Personal Care',
  'Other',
];

export default function BudgetSettings() {
  const { budgets, suggestions, setBudget, deleteBudget, setSuggestions, applyAllSuggestions } = useBudgetStore();
  const [newCategory, setNewCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Generate suggestions when component mounts
    const newSuggestions = generateBudgetSuggestions();
    setSuggestions(newSuggestions);
  }, []);

  const handleAddBudget = (e) => {
    e.preventDefault();
    const category = newCategory === '__custom__' ? customCategory.trim() : newCategory;
    if (!category || !newAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setBudget(category, amount);
    setNewCategory('');
    setCustomCategory('');
    setNewAmount('');
    toast.success('Budget added successfully');
  };

  const handleDeleteBudget = (category) => {
    deleteBudget(category);
    toast.success('Budget deleted successfully');
  };

  const handleApplySuggestions = () => {
    applyAllSuggestions();
    setShowSuggestions(false);
    toast.success('Budget suggestions applied successfully');
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-2 sm:px-4 flex flex-col items-center bg-transparent w-full">
      <div className="w-full max-w-3xl mt-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Budget Settings</h2>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            {showSuggestions ? 'Hide Suggestions' : 'Show AI Suggestions'}
          </button>
        </div>

        {/* AI Suggestions Modal */}
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 w-full"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">AI-Powered Budget Suggestions</h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              Based on your spending patterns over the last 3 months, here are our suggested budget limits:
            </p>
            <div className="space-y-4">
              {Object.entries(suggestions).map(([category, amount]) => (
                <div key={category} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-700 p-3 sm:p-4 rounded-lg gap-2">
                  <div>
                    <h4 className="text-white font-medium text-base sm:text-lg">{category}</h4>
                    <p className="text-gray-400 text-sm">Suggested: ₹{amount}</p>
                  </div>
                  <button
                    onClick={() => {
                      setBudget(category, amount);
                      toast.success(`Budget set for ${category}`);
                    }}
                    className="p-2 text-indigo-400 hover:text-indigo-300"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleApplySuggestions}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Apply All Suggestions
            </button>
          </motion.div>
        )}

        {/* Add New Budget Form */}
        <form onSubmit={handleAddBudget} className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Add New Budget</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__custom__">Other (Custom)</option>
              </select>
              {newCategory === '__custom__' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  className="w-full mt-2 bg-gray-700 text-white rounded-lg px-3 py-2"
                  placeholder="Enter custom category"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                placeholder="e.g., 3000"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Budget
          </button>
        </form>

        {/* Existing Budgets */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Current Budgets</h3>
          <div className="space-y-4">
            {Object.entries(budgets).map(([category, budget]) => (
              <div key={category} className="bg-gray-700 rounded-lg p-3 sm:p-4 flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between mb-2">
                  <h4 className="text-white font-medium text-base sm:text-lg break-words max-w-[70%]">{category}</h4>
                  <button
                    onClick={() => handleDeleteBudget(category)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors ml-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-row justify-between text-sm mb-1">
                  <span className="text-gray-400">Limit:</span>
                  <span className="text-white">₹{budget.limit}</span>
                </div>
                <div className="flex flex-row justify-between text-sm mb-1">
                  <span className="text-gray-400">Spent:</span>
                  <span className="text-white">₹{budget.spent}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      budget.spent >= budget.limit
                        ? 'bg-red-500'
                        : budget.spent >= budget.limit * 0.8
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 