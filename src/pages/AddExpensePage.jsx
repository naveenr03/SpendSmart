import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useExpenseStore from '../store/expenseStore';
import { motion } from 'framer-motion';

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

export default function AddExpensePage() {
  const navigate = useNavigate();
  const addExpense = useExpenseStore((state) => state.addExpense);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    addExpense({
      ...data,
      amount: parseFloat(data.amount),
      date: new Date(data.date).toISOString(),
    });
    toast.success('Expense added successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto rounded-2xl bg-gray-800/80 border border-gray-700 shadow-xl backdrop-blur-md p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">Add New Expense</h2>
          <p className="text-gray-400 text-sm">Track your spending by adding a new expense</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
              Amount
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                })}
                className="block w-full pl-7 pr-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-400">{errors.amount.message}</p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="block w-full bg-gray-900/70 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500 py-2 px-3"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="block w-full bg-gray-900/70 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition py-2 px-3"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category} className="bg-gray-900 text-gray-100">
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>
            )}
          </div>

          {/* Note Field */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-300 mb-1">
              Note (Optional)
            </label>
            <textarea
              {...register('note')}
              rows={3}
              className="block w-full bg-gray-900/70 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500 py-2 px-3"
              placeholder="Add a note about this expense..."
            />
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 rounded-full bg-gray-700/60 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:from-indigo-400 hover:to-purple-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Expense
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 