import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useBudgetStore from '../store/budgetStore';
import { generateSmartBudgetSuggestions, generateDetailedBudgetAnalysis } from '../utils/budgetSuggestions';
import { PlusIcon, TrashIcon, CheckIcon, LightBulbIcon, ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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

// Helper function to get consistency level color
const getConsistencyColor = (level) => {
  switch (level) {
    case 'stable': return 'text-green-400';
    case 'low-variance': return 'text-blue-400';
    case 'moderate-variance': return 'text-yellow-400';
    case 'high-variance': return 'text-orange-400';
    default: return 'text-gray-400';
  }
};

// Helper function to get consistency icon
const getConsistencyIcon = (level) => {
  switch (level) {
    case 'stable': return '✅';
    case 'low-variance': return '📊';
    case 'moderate-variance': return '📈';
    case 'high-variance': return '⚠️';
    default: return '📊';
  }
};

export default function BudgetSettings() {
  const { budgets, suggestions, setBudget, deleteBudget, setSuggestions, applyAllSuggestions } = useBudgetStore();
  const [newCategory, setNewCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState({});
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // Generate smart suggestions when component mounts
    const newSmartSuggestions = generateSmartBudgetSuggestions();
    const detailedAnalysis = generateDetailedBudgetAnalysis();
    setSmartSuggestions(newSmartSuggestions);
    setAnalysis(detailedAnalysis);
    
    // Also set simple suggestions for backward compatibility
    const simpleSuggestions = {};
    Object.entries(newSmartSuggestions).forEach(([category, data]) => {
      simpleSuggestions[category] = data.bufferedSuggestion;
    });
    setSuggestions(simpleSuggestions);
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

  const handleApplySingleSuggestion = (category, amount) => {
    setBudget(category, amount);
    toast.success(`Budget set for ${category}`);
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-2 sm:px-4 flex flex-col items-center bg-transparent w-full">
      <div className="w-full max-w-4xl mt-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Budget Settings</h2>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <LightBulbIcon className="h-5 w-5" />
            {showSuggestions ? 'Hide Smart Suggestions' : 'Smart Budget Suggestions'}
          </button>
        </div>

        {/* Smart Suggestions Modal */}
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 w-full border border-gray-700 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <LightBulbIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Smart Budget Analysis</h3>
                <p className="text-gray-400 text-sm">AI-powered insights based on your spending patterns</p>
              </div>
            </div>

            {/* Analysis Summary */}
            {analysis && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{analysis.summary.totalCategories}</div>
                  <div className="text-gray-400 text-sm">Categories</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{analysis.summary.stableCategories}</div>
                  <div className="text-gray-400 text-sm">Stable</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{analysis.summary.variableCategories}</div>
                  <div className="text-gray-400 text-sm">Variable</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{analysis.summary.overspendingCategories}</div>
                  <div className="text-gray-400 text-sm">Overspending</div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {Object.entries(smartSuggestions).map(([category, data]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-700 rounded-xl p-4 border-l-4 border-indigo-500"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-semibold text-lg">{category}</h4>
                        <span className="text-sm">{getConsistencyIcon(data.consistencyLevel)}</span>
                        <span className={`text-sm font-medium ${getConsistencyColor(data.consistencyLevel)}`}>
                          {data.consistencyLevel.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-gray-400 text-sm">Average</div>
                          <div className="text-white font-medium">₹{data.average}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">Suggested</div>
                          <div className="text-indigo-400 font-bold">₹{data.bufferedSuggestion}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">Buffer</div>
                          <div className="text-white font-medium">
                            +{Math.round(((data.bufferedSuggestion / data.average) - 1) * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-300 bg-gray-800 rounded-lg p-3">
                        {data.feedback}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApplySingleSuggestion(category, data.bufferedSuggestion)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2"
                      >
                        <CheckIcon className="h-4 w-4" />
                        Apply
                      </button>
                      
                      {data.hasOverspending && (
                        <div className="flex items-center gap-1 text-red-400 text-xs">
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          Overspending detected
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApplySuggestions}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
              >
                <CheckIcon className="h-5 w-5" />
                Apply All Smart Suggestions
              </button>
              
              {analysis && (
                <div className="px-4 py-3 bg-gray-700 rounded-xl text-center">
                  <div className="text-white font-semibold">₹{analysis.summary.totalSuggestedBudget.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Total Suggested Budget</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Add New Budget Form */}
        <form onSubmit={handleAddBudget} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <PlusIcon className="h-6 w-6 text-indigo-400" />
            Add New Budget
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
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
                  className="w-full mt-3 bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
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
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="e.g., 3000"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
          >
            <PlusIcon className="h-5 w-5" />
            Add Budget
          </button>
        </form>

        {/* Existing Budgets */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6 text-indigo-400" />
            Current Budgets
          </h3>
          <div className="space-y-4">
            {Object.entries(budgets).map(([category, budget]) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const status = percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : percentage >= 60 ? 'caution' : 'good';
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-700 rounded-xl p-4 border-l-4 border-gray-600 hover:border-indigo-500 transition-all duration-300"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center justify-between">
                      <h4 className="text-white font-semibold text-lg break-words max-w-[70%]">{category}</h4>
                      <button
                        onClick={() => handleDeleteBudget(category)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="text-gray-400 text-sm">Limit</div>
                        <div className="text-white font-semibold">₹{budget.limit.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Spent</div>
                        <div className="text-white font-semibold">₹{budget.spent.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Remaining</div>
                        <div className={`font-semibold ${
                          budget.limit - budget.spent < 0 ? 'text-red-400' : 'text-green-400'
                        }`}>
                          ₹{(budget.limit - budget.spent).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className={`font-medium ${
                          status === 'exceeded' ? 'text-red-400' :
                          status === 'warning' ? 'text-yellow-400' :
                          status === 'caution' ? 'text-orange-400' : 'text-green-400'
                        }`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            status === 'exceeded' ? 'bg-red-500' :
                            status === 'warning' ? 'bg-yellow-500' :
                            status === 'caution' ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {Object.keys(budgets).length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">No budgets set yet</div>
                <div className="text-gray-500 text-sm">Create your first budget above or use smart suggestions</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 