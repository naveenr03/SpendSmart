import { useState } from 'react';
import { motion } from 'framer-motion';
import useTransactionGroupsStore from '../store/transactionGroupsStore';
import useExpenseStore from '../store/expenseStore';
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

const TransactionGroups = () => {
  const { groups, updateGroupCategory, removeGroup } = useTransactionGroupsStore();
  const addExpenses = useExpenseStore((state) => state.addExpenses);
  const [expandedGroup, setExpandedGroup] = useState(null);

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString();

    try {
      // Try DD/MM/YY format
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        // Convert 2-digit year to 4-digit year
        const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
        const date = new Date(fullYear, parseInt(month) - 1, parseInt(day));
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        return date.toISOString();
      }
      
      // Try DD-MM-YYYY format
      if (dateStr.includes('-')) {
        const [day, month, year] = dateStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        return date.toISOString();
      }

      // Try YYYY-MM-DD format
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      return date.toISOString();
    } catch (error) {
      console.warn('Date parsing failed, using current date:', error);
      return new Date().toISOString();
    }
  };

  const formatDescription = (description) => {
    if (!description) return '';

    // Remove common SMS prefixes and suffixes
    let formattedDesc = description
      .replace(/^Dear\s+Customer,\s*/i, '')
      .replace(/^Your\s+account\s+has\s+been\s+debited\s+by\s+/i, '')
      .replace(/^Rs\.?\s*\d+(?:,\d+)*(?:\.\d{2})?\s+has\s+been\s+debited\s+from\s+your\s+account\s+/i, '')
      .replace(/^A\/c\s+\d+\s+/i, '')
      .replace(/^on\s+\d{2}[-/]\d{2}[-/]\d{2,4}\s+/i, '')
      .replace(/\s+for\s+.*$/i, '')
      .replace(/\s+Thank\s+you\s+for\s+using\s+our\s+services\.?$/i, '')
      .trim();

    // If the description is too long, truncate it
    if (formattedDesc.length > 100) {
      formattedDesc = formattedDesc.substring(0, 97) + '...';
    }

    return formattedDesc || 'Transaction';
  };

  const handleCategoryChange = (groupId, category) => {
    if (!category) return; // Don't process if no category selected

    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    try {
      // Add transactions to the expense store first
      const expensesToAdd = group.transactions.map((transaction) => {
        const parsedDate = parseDate(transaction.date);
        const formattedDescription = formatDescription(transaction.description);
        
        return {
          amount: transaction.amount,
          category,
          date: parsedDate,
          note: formattedDescription,
          description: formattedDescription, // Add description field
        };
      });

      addExpenses(expensesToAdd);

      // Update the category in the groups store
      updateGroupCategory(groupId, category);

      // Remove the group after successful tagging
      removeGroup(groupId);
      
      toast.success(`Added ${expensesToAdd.length} transactions to expenses`);
    } catch (error) {
      console.error('Error adding transactions:', error);
      toast.error('Failed to add transactions');
    }
  };

  if (groups.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No transaction groups found. Upload an XML file to see grouped transactions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gray-800/80 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-200">
                {group.type === 'account'
                  ? `Account Group (****${group.key})`
                  : `Amount Group (Rs. ${group.key})`}
              </h3>
              <p className="text-sm text-gray-400">
                {group.transactions.length} transactions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={group.category || ''}
                onChange={(e) => handleCategoryChange(group.id, e.target.value)}
                className="bg-gray-900/70 border border-gray-700 rounded-lg text-gray-100 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  setExpandedGroup(expandedGroup === group.id ? null : group.id)
                }
                className="text-gray-400 hover:text-gray-300"
              >
                {expandedGroup === group.id ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {expandedGroup === group.id && (
            <div className="space-y-3 mt-4">
              {group.transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-300 font-medium">
                        Rs. {transaction.amount.toFixed(2)}
                      </p>
                      {transaction.accountLast4 && (
                        <p className="text-sm text-gray-400">
                          A/C: ****{transaction.accountLast4}
                        </p>
                      )}
                      {transaction.date && (
                        <p className="text-sm text-gray-400">
                          Date: {transaction.date}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                    {formatDescription(transaction.description)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionGroups; 