import { useState } from 'react';

export default function GoalForm({ onSubmit, initial = {} }) {
  const [goalName, setGoalName] = useState(initial.goalName || '');
  const [targetAmount, setTargetAmount] = useState(initial.targetAmount || '');
  const [deadline, setDeadline] = useState(initial.deadline || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalName.trim() || !targetAmount || !deadline) {
      setError('All fields are required');
      return;
    }
    if (isNaN(targetAmount) || Number(targetAmount) <= 0) {
      setError('Target amount must be a positive number');
      return;
    }
    setError('');
    onSubmit({
      goalName: goalName.trim(),
      targetAmount: Number(targetAmount),
      deadline,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl w-full max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white mb-2">Set a Savings Goal</h2>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Goal Name</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={goalName}
          onChange={e => setGoalName(e.target.value)}
          placeholder="e.g. Emergency Fund, New Laptop"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Target Amount (₹)</label>
        <input
          type="number"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={targetAmount}
          onChange={e => setTargetAmount(e.target.value)}
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Deadline</label>
        <input
          type="date"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all"
      >
        Save Goal
      </button>
    </form>
  );
} 