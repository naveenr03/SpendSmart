import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateSmartBudgetSuggestions, generateDetailedBudgetAnalysis, generateDemoExpenses } from '../utils/budgetSuggestions';
import useBudgetStore from '../store/budgetStore';
import useExpenseStore from '../store/expenseStore';
import { LightBulbIcon, ChartBarIcon, ExclamationTriangleIcon, CheckIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, PlayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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
    case 'stable': return 'Stable';
    case 'low-variance': return 'Low Var';
    case 'moderate-variance': return 'Mod Var';
    case 'high-variance': return 'High Var';
    default: return 'Unknown';
  }
};

// Helper function to get trend icon
const getTrendIcon = (monthlyData) => {
  if (monthlyData.length < 2) return null;
  
  const recent = monthlyData.slice(-3);
  const isIncreasing = recent.every((val, index) => 
    index === 0 || val >= recent[index - 1]
  );
  
  return isIncreasing ? 
    <ArrowTrendingUpIcon className="h-4 w-4 text-red-400" /> : 
    <ArrowTrendingDownIcon className="h-4 w-4 text-green-400" />;
};

export default function SmartBudgetPage() {
  const { setBudget, applyAllSuggestions, clearSuggestions, suggestions } = useBudgetStore();
  const { addExpenses } = useExpenseStore();
  const [smartSuggestions, setSmartSuggestions] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const generateSuggestions = () => {
      setIsLoading(true);
      try {
        const newSmartSuggestions = generateSmartBudgetSuggestions();
        const detailedAnalysis = generateDetailedBudgetAnalysis();
        setSmartSuggestions(newSmartSuggestions);
        setAnalysis(detailedAnalysis);
        setHasData(Object.keys(newSmartSuggestions).length > 0);
      } catch (error) {
        console.error('Error generating suggestions:', error);
        toast.error('Error analyzing spending patterns');
      } finally {
        setIsLoading(false);
      }
    };

    generateSuggestions();
  }, []);

  const handleApplySingleSuggestion = (category, amount) => {
    setBudget(category, amount);
    toast.success(`Budget set for ${category}`);
  };

  const handleApplyAllSuggestions = () => {
    applyAllSuggestions();
    toast.success('All smart budget suggestions applied successfully');
  };

  const handleRefreshAnalysis = () => {
    const newSmartSuggestions = generateSmartBudgetSuggestions();
    const detailedAnalysis = generateDetailedBudgetAnalysis();
    setSmartSuggestions(newSmartSuggestions);
    setAnalysis(detailedAnalysis);
    setHasData(Object.keys(newSmartSuggestions).length > 0);
    toast.success('Analysis refreshed with latest data');
  };

  const handleLoadDemoData = () => {
    const demoExpenses = generateDemoExpenses();
    addExpenses(demoExpenses);
    toast.success('Demo data loaded! Analyzing spending patterns...');
    
    // Refresh analysis after a short delay
    setTimeout(() => {
      handleRefreshAnalysis();
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-8 px-2 sm:px-4 flex flex-col items-center justify-center bg-transparent w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Analyzing your spending patterns...</div>
          <div className="text-gray-400 text-sm mt-2">This may take a few moments</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-8 px-2 sm:px-4 flex flex-col items-center bg-transparent w-full">
      <div className="w-full max-w-6xl mt-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <LightBulbIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Smart Budget Suggestions</h1>
              <p className="text-gray-400">AI-powered budget recommendations based on your spending patterns</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {!hasData && (
              <button
                onClick={handleLoadDemoData}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center gap-2"
              >
                <PlayIcon className="h-4 w-4" />
                Try Demo Data
              </button>
            )}
            <button
              onClick={handleRefreshAnalysis}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Refresh Analysis
            </button>
            {hasData && (
              <button
                onClick={handleApplyAllSuggestions}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                <CheckIcon className="h-5 w-5" />
                Apply All
              </button>
            )}
            {hasData && (
              <button
                onClick={() => {
                  clearSuggestions();
                  setSmartSuggestions({});
                  setAnalysis(null);
                  setHasData(false);
                  toast.success('Smart budget suggestions removed');
                }}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                Remove Suggestions
              </button>
            )}
          </div>
        </div>

        {/* Analysis Summary */}
        {analysis && hasData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ChartBarIcon className="h-6 w-6 text-indigo-400" />
              Spending Analysis Summary
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="bg-gray-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white">{analysis.summary.totalCategories}</div>
                <div className="text-gray-400 text-sm">Categories Analyzed</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{analysis.summary.stableCategories}</div>
                <div className="text-gray-400 text-sm">Stable Spending</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">{analysis.summary.variableCategories}</div>
                <div className="text-gray-400 text-sm">Variable Spending</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{analysis.summary.overspendingCategories}</div>
                <div className="text-gray-400 text-sm">Overspending Detected</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-indigo-400">₹{analysis.summary.totalSuggestedBudget.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Total Suggested</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Smart Suggestions Grid */}
        {hasData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(smartSuggestions).map(([category, data], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl hover:border-indigo-500 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{category}</h3>
                    <span className="text-sm text-gray-400">{getConsistencyIcon(data.consistencyLevel)}</span>
                    {getTrendIcon(data.monthlyData)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConsistencyColor(data.consistencyLevel)} bg-gray-700`}>
                    {data.consistencyLevel.replace('-', ' ')}
                  </span>
                </div>

                {/* Spending Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Average</div>
                    <div className="text-white font-semibold text-lg">₹{data.average.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Suggested</div>
                    <div className="text-indigo-400 font-bold text-lg">₹{data.bufferedSuggestion.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Buffer</div>
                    <div className="text-white font-semibold text-lg">
                      +{Math.round(((data.bufferedSuggestion / data.average) - 1) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Monthly Spending Chart */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Monthly Spending Trend</span>
                    <span>{data.monthsAnalyzed} months</span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {data.monthlyData.map((amount, i) => {
                      const maxAmount = Math.max(...data.monthlyData);
                      const height = (amount / maxAmount) * 100;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-indigo-500 rounded-t transition-all duration-300 hover:bg-indigo-400"
                          style={{ height: `${height}%` }}
                          title={`Month ${i + 1}: ₹${amount.toLocaleString()}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Message */}
                <div className="bg-gray-700 rounded-lg p-3 mb-4">
                  <div className="text-sm text-gray-300">{data.feedback}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApplySingleSuggestion(category, data.bufferedSuggestion)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <CheckIcon className="h-4 w-4" />
                    Apply Suggestion
                  </button>
                  
                  {data.hasOverspending && (
                    <div className="flex items-center gap-1 text-red-400 text-xs px-2">
                      <ExclamationTriangleIcon className="h-3 w-3" />
                      Overspending
                    </div>
                  )}
                </div>

                {/* Additional Insights */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Variation</div>
                      <div className="text-white">{(data.coefficientOfVariation * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Highest Month</div>
                      <div className="text-white">₹{Math.max(...data.monthlyData).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!hasData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
              <div className="text-gray-400 text-xl mb-4">No spending data available</div>
              <div className="text-gray-500 text-sm mb-6">
                Add some expenses to get smart budget suggestions, or try our demo data to see how it works
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleLoadDemoData}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <PlayIcon className="h-5 w-5" />
                  Try Demo Data
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard/add-expense'}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
                >
                  Add Your First Expense
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 