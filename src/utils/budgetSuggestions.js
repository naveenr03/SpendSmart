import useExpenseStore from '../store/expenseStore';

export const generateBudgetSuggestions = () => {
  const expenses = useExpenseStore.getState().expenses;
  
  // Get current date and calculate date 3 months ago
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  
  // Filter expenses from last 3 months
  const recentExpenses = expenses.filter(expense => 
    new Date(expense.date) >= threeMonthsAgo
  );
  
  // Group expenses by category
  const categoryTotals = {};
  const categoryCounts = {};
  
  recentExpenses.forEach(expense => {
    const category = expense.category;
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
      categoryCounts[category] = 0;
    }
    categoryTotals[category] += expense.amount;
    categoryCounts[category]++;
  });
  
  // Calculate average monthly spending per category
  const suggestions = {};
  Object.entries(categoryTotals).forEach(([category, total]) => {
    const months = Math.max(1, categoryCounts[category] / 4); // Approximate months
    const monthlyAverage = total / months;
    
    // Add 10% buffer to the average
    suggestions[category] = Math.round(monthlyAverage * 1.1);
  });
  
  return suggestions;
};

// Helper function to check if a category is close to or has exceeded its budget
export const getBudgetStatus = (spent, limit) => {
  const percentage = (spent / limit) * 100;
  
  if (percentage >= 100) {
    return {
      status: 'exceeded',
      message: 'Budget exceeded!',
      color: 'red',
    };
  } else if (percentage >= 80) {
    return {
      status: 'warning',
      message: 'Close to budget limit',
      color: 'yellow',
    };
  } else {
    return {
      status: 'good',
      message: 'Within budget',
      color: 'green',
    };
  }
}; 