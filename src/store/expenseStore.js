import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) => {
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: Date.now() }],
        }));
      },
      addExpenses: (newExpenses) => {
        set((state) => ({
          expenses: [
            ...state.expenses,
            ...newExpenses.map((expense) => ({ ...expense, id: Date.now() + Math.random() })),
          ],
        }));
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