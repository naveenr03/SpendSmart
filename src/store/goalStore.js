import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Goal model:
 * {
 *   id: string,
 *   goalName: string,
 *   targetAmount: number,
 *   deadline: string (ISO date),
 *   savedSoFar: number,
 *   status: 'active' | 'completed' | 'archived',
 *   createdAt: string,
 * }
 */

const useGoalStore = create(
  persist(
    (set, get) => ({
      goals: [],
      // Add a new goal
      addGoal: (goal) => {
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goal,
              id: Date.now().toString(),
              savedSoFar: goal.savedSoFar || 0,
              status: 'active',
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },
      // Update a goal
      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        }));
      },
      // Delete a goal
      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },
      // Add savings to a goal
      addSavings: (id, amount) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  savedSoFar: g.savedSoFar + amount,
                  status:
                    g.savedSoFar + amount >= g.targetAmount
                      ? 'completed'
                      : g.status,
                }
              : g
          ),
        }));
      },
      // Get progress percentage
      getProgress: (id) => {
        const goal = get().goals.find((g) => g.id === id);
        if (!goal) return 0;
        return Math.min(100, (goal.savedSoFar / goal.targetAmount) * 100);
      },
    }),
    {
      name: 'goal-storage',
    }
  )
);

export default useGoalStore; 