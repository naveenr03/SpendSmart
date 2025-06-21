import useExpenseStore from '../store/expenseStore';

// Helper function to calculate standard deviation
const calculateStandardDeviation = (values) => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
};

// Helper function to calculate coefficient of variation (CV = std dev / mean)
const calculateCoefficientOfVariation = (values) => {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  if (mean === 0) return 0;
  const stdDev = calculateStandardDeviation(values);
  return stdDev / mean;
};

// Helper function to detect overspending patterns
const detectOverspending = (monthlyTotals) => {
  if (monthlyTotals.length < 2) return false;
  
  // Check if recent months show increasing trend
  const recentMonths = monthlyTotals.slice(-3);
  const isIncreasing = recentMonths.every((val, index) => 
    index === 0 || val >= recentMonths[index - 1]
  );
  
  // Check if any month is significantly higher than average
  const average = monthlyTotals.reduce((sum, val) => sum + val, 0) / monthlyTotals.length;
  const hasSpikes = monthlyTotals.some(val => val > average * 1.5);
  
  return isIncreasing || hasSpikes;
};

export const generateSmartBudgetSuggestions = () => {
  const expenses = useExpenseStore.getState().expenses;
  
  // Get current date and calculate date 6 months ago for better analysis
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  
  // Filter expenses from last 6 months
  const recentExpenses = expenses.filter(expense => 
    new Date(expense.date) >= sixMonthsAgo
  );
  
  // Group expenses by category and month
  const categoryMonthlyData = {};
  
  recentExpenses.forEach(expense => {
    const category = expense.category;
    const expenseDate = new Date(expense.date);
    const monthKey = `${expenseDate.getFullYear()}-${expenseDate.getMonth()}`;
    
    if (!categoryMonthlyData[category]) {
      categoryMonthlyData[category] = {};
    }
    
    if (!categoryMonthlyData[category][monthKey]) {
      categoryMonthlyData[category][monthKey] = 0;
    }
    
    categoryMonthlyData[category][monthKey] += expense.amount;
  });
  
  const suggestions = {};
  
  Object.entries(categoryMonthlyData).forEach(([category, monthlyData]) => {
    const monthlyTotals = Object.values(monthlyData);
    
    if (monthlyTotals.length === 0) return;
    
    // Calculate average monthly spending
    const average = monthlyTotals.reduce((sum, val) => sum + val, 0) / monthlyTotals.length;
    
    // Calculate consistency using coefficient of variation
    const cv = calculateCoefficientOfVariation(monthlyTotals);
    
    // Detect overspending patterns
    const hasOverspending = detectOverspending(monthlyTotals);
    
    // Determine buffer based on spending behavior
    let buffer = 0.05; // Default 5% buffer
    let feedback = '';
    
    if (hasOverspending) {
      buffer = 0.20; // 20% buffer for overspending
      feedback = 'Detected increasing spending trend. Consider reducing expenses in this category.';
    } else if (cv > 0.5) {
      buffer = 0.15; // 15% buffer for high variance
      feedback = 'Spending is inconsistent. Added higher buffer for flexibility.';
    } else if (cv > 0.3) {
      buffer = 0.10; // 10% buffer for moderate variance
      feedback = 'Moderate spending variation. Added buffer for monthly fluctuations.';
    } else {
      buffer = 0.05; // 5% buffer for stable spending
      feedback = 'Spending is consistent. Minimal buffer added.';
    }
    
    // Calculate buffered suggestion
    const bufferedSuggestion = Math.round(average * (1 + buffer));
    
    // Determine spending consistency level
    let consistencyLevel = 'stable';
    if (cv > 0.5) consistencyLevel = 'high-variance';
    else if (cv > 0.3) consistencyLevel = 'moderate-variance';
    else if (cv > 0.15) consistencyLevel = 'low-variance';
    
    suggestions[category] = {
      average: Math.round(average),
      bufferedSuggestion,
      feedback,
      consistencyLevel,
      coefficientOfVariation: cv,
      hasOverspending,
      monthlyData: monthlyTotals,
      monthsAnalyzed: monthlyTotals.length
    };
  });
  
  return suggestions;
};

// Enhanced version that returns detailed analysis
export const generateDetailedBudgetAnalysis = () => {
  const suggestions = generateSmartBudgetSuggestions();
  const analysis = {
    suggestions: {},
    summary: {
      totalCategories: Object.keys(suggestions).length,
      stableCategories: 0,
      variableCategories: 0,
      overspendingCategories: 0,
      totalSuggestedBudget: 0
    }
  };
  
  Object.entries(suggestions).forEach(([category, data]) => {
    analysis.suggestions[category] = data;
    analysis.summary.totalSuggestedBudget += data.bufferedSuggestion;
    
    if (data.hasOverspending) {
      analysis.summary.overspendingCategories++;
    } else if (data.consistencyLevel === 'stable' || data.consistencyLevel === 'low-variance') {
      analysis.summary.stableCategories++;
    } else {
      analysis.summary.variableCategories++;
    }
  });
  
  return analysis;
};

// Legacy function for backward compatibility
export const generateBudgetSuggestions = () => {
  const suggestions = generateSmartBudgetSuggestions();
  const simpleSuggestions = {};
  
  Object.entries(suggestions).forEach(([category, data]) => {
    simpleSuggestions[category] = data.bufferedSuggestion;
  });
  
  return simpleSuggestions;
};

// Helper function to check if a category is close to or has exceeded its budget
export const getBudgetStatus = (spent, limit) => {
  const percentage = (spent / limit) * 100;
  
  if (percentage >= 100) {
    return {
      status: 'exceeded',
      message: 'Budget exceeded!',
      color: 'red',
      percentage
    };
  } else if (percentage >= 80) {
    return {
      status: 'warning',
      message: 'Close to budget limit',
      color: 'yellow',
      percentage
    };
  } else if (percentage >= 60) {
    return {
      status: 'caution',
      message: 'Moderate spending',
      color: 'orange',
      percentage
    };
  } else {
    return {
      status: 'good',
      message: 'Within budget',
      color: 'green',
      percentage
    };
  }
};

// Helper function to generate demo data for testing
export const generateDemoExpenses = () => {
  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities'];
  const demoExpenses = [];
  const now = new Date();
  
  // Generate 6 months of data
  for (let month = 5; month >= 0; month--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - month, 1);
    
    categories.forEach((category, categoryIndex) => {
      // Generate 3-8 expenses per category per month
      const numExpenses = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < numExpenses; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const expenseDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        
        // Generate realistic amounts based on category
        let baseAmount = 0;
        let variance = 0;
        
        switch (category) {
          case 'Food & Dining':
            baseAmount = 800;
            variance = 0.4;
            break;
          case 'Transportation':
            baseAmount = 1200;
            variance = 0.3;
            break;
          case 'Shopping':
            baseAmount = 1500;
            variance = 0.6;
            break;
          case 'Entertainment':
            baseAmount = 600;
            variance = 0.8;
            break;
          case 'Bills & Utilities':
            baseAmount = 2000;
            variance = 0.2;
            break;
          default:
            baseAmount = 1000;
            variance = 0.5;
        }
        
        // Add some monthly variation and trends
        let monthlyMultiplier = 1;
        if (month === 0) monthlyMultiplier = 1.2; // Recent month has higher spending
        if (month === 1) monthlyMultiplier = 1.1;
        if (month === 2) monthlyMultiplier = 0.9;
        
        const amount = Math.round(
          (baseAmount + (Math.random() - 0.5) * baseAmount * variance) * monthlyMultiplier
        );
        
        demoExpenses.push({
          id: Date.now() + Math.random(),
          category,
          amount,
          date: expenseDate.toISOString().split('T')[0],
          description: `${category} expense ${i + 1}`,
        });
      }
    });
  }
  
  return demoExpenses;
}; 