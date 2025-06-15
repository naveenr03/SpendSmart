import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useBudgetStore from './budgetStore';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) => {
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: Date.now() }],
        }));
        // Track in budget
        useBudgetStore.getState().trackExpense(expense);
      },
      addExpenses: (newExpenses) => {
        set((state) => ({
          expenses: [
            ...state.expenses,
            ...newExpenses.map((expense) => ({ ...expense, id: Date.now() + Math.random() })),
          ],
        }));
        // Track in budget
        useBudgetStore.getState().trackExpenses(newExpenses);
      },
      removeExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },
      clearExpenses: () => set({ expenses: [] }),
    }),
    {
      name: 'expense-storage',
    }
  )
);

export default useExpenseStore; 