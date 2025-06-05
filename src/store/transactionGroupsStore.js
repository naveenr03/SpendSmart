import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTransactionGroupsStore = create(
  persist(
    (set, get) => ({
      // Store for account number to category mapping
      accountCategories: {},
      // Store for amount to category mapping
      amountCategories: {},
      // Store for transaction groups
      groups: [],
      // Store for parsed transactions
      parsedTransactions: [],

      // Add a new category mapping
      addCategoryMapping: (type, key, category) => {
        if (type === 'account') {
          set((state) => ({
            accountCategories: {
              ...state.accountCategories,
              [key]: category,
            },
          }));
        } else if (type === 'amount') {
          set((state) => ({
            amountCategories: {
              ...state.amountCategories,
              [key]: category,
            },
          }));
        }
      },

      // Group transactions based on account number or amount
      groupTransactions: (transactions) => {
        const groups = [];
        const processedIds = new Set();

        transactions.forEach((transaction, index) => {
          if (processedIds.has(index)) return;

          const group = {
            id: `group-${index}`,
            transactions: [transaction],
            category: null,
            type: null,
            key: null,
          };

          // Check for account number match
          if (transaction.accountLast4) {
            const accountMatches = transactions.filter(
              (t, i) =>
                i !== index &&
                !processedIds.has(i) &&
                t.accountLast4 === transaction.accountLast4
            );

            if (accountMatches.length > 0) {
              group.type = 'account';
              group.key = transaction.accountLast4;
              group.transactions.push(...accountMatches);
              accountMatches.forEach((_, i) => processedIds.add(i));
            }
          }

          // Check for amount match if no account match found
          if (group.transactions.length === 1) {
            const amountMatches = transactions.filter(
              (t, i) =>
                i !== index &&
                !processedIds.has(i) &&
                t.amount === transaction.amount
            );

            if (amountMatches.length > 0) {
              group.type = 'amount';
              group.key = transaction.amount.toString();
              group.transactions.push(...amountMatches);
              amountMatches.forEach((_, i) => processedIds.add(i));
            }
          }

          // Set initial category based on stored mappings
          if (group.type === 'account') {
            group.category = get().accountCategories[group.key] || null;
          } else if (group.type === 'amount') {
            group.category = get().amountCategories[group.key] || null;
          }

          if (group.transactions.length > 1) {
            groups.push(group);
          }
        });

        set({ groups, parsedTransactions: transactions });
      },

      // Update group category
      updateGroupCategory: (groupId, category) => {
        set((state) => {
          const updatedGroups = state.groups.map((group) => {
            if (group.id === groupId) {
              // Update the category mapping in the store
              if (group.type === 'account') {
                state.addCategoryMapping('account', group.key, category);
              } else if (group.type === 'amount') {
                state.addCategoryMapping('amount', group.key, category);
              }
              return { ...group, category };
            }
            return group;
          });
          return { groups: updatedGroups };
        });
      },

      // Remove a group after tagging
      removeGroup: (groupId) => {
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== groupId),
        }));
      },

      // Clear all groups and parsed transactions
      clearGroups: () => set({ groups: [], parsedTransactions: [] }),
    }),
    {
      name: 'transaction-groups-storage',
    }
  )
);

export default useTransactionGroupsStore; 