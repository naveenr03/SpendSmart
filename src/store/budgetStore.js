import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: {},
      suggestions: {},
      
      // Set budget for a category
      setBudget: (category, amount) => {
        set((state) => ({
          budgets: {
            ...state.budgets,
            [category]: {
              limit: amount,
              spent: state.budgets[category]?.spent || 0,
              lastUpdated: new Date().toISOString(),
            },
          },
        }));
      },

      // Update spent amount for a category
      updateSpent: (category, amount) => {
        set((state) => ({
          budgets: {
            ...state.budgets,
            [category]: {
              ...state.budgets[category],
              spent: (state.budgets[category]?.spent || 0) + amount,
            },
          },
        }));
      },

      // Hook for expense store to call when a new expense is added
      trackExpense: (expense) => {
        const { category, amount } = expense;
        if (get().budgets[category]) {
          get().updateSpent(category, amount);
        }
      },
      // For batch add
      trackExpenses: (expenses) => {
        expenses.forEach((expense) => {
          const { category, amount } = expense;
          if (get().budgets[category]) {
            get().updateSpent(category, amount);
          }
        });
      },

      // Delete budget for a category
      deleteBudget: (category) => {
        set((state) => {
          const newBudgets = { ...state.budgets };
          delete newBudgets[category];
          return { budgets: newBudgets };
        });
      },

      // Set suggestions
      setSuggestions: (suggestions) => {
        set({ suggestions });
      },

      // Apply all suggestions
      applyAllSuggestions: () => {
        const { suggestions } = get();
        Object.entries(suggestions).forEach(([category, amount]) => {
          get().setBudget(category, amount);
        });
      },

      // Reset spent amounts at the start of each month
      resetMonthlySpending: () => {
        set((state) => {
          const newBudgets = {};
          Object.entries(state.budgets).forEach(([category, budget]) => {
            newBudgets[category] = {
              ...budget,
              spent: 0,
              lastUpdated: new Date().toISOString(),
            };
          });
          return { budgets: newBudgets };
        });
      },
    }),
    {
      name: 'budget-storage',
    }
  )
);

export default useBudgetStore; 