# SpendWise+ - Smart Personal Finance App

A modern, full-stack personal finance web application with AI-powered budget suggestions and comprehensive expense tracking.

## 🚀 Features

### Core Features
- **Smart Budget Suggestions** - AI-powered budget recommendations based on spending patterns
- **Expense Tracking** - Manual expense entry with categorization
- **Dashboard Analytics** - Visual charts and spending insights
- **Budget Management** - Set and track monthly budget limits
- **Transaction History** - Complete expense history with filtering

### Smart Budget Suggestion Utility

The Smart Budget Suggestion Utility analyzes your spending patterns using advanced statistical methods:

#### 🔧 Analysis Logic
- **Data Analysis**: Analyzes past transactions from localStorage, grouped by category and month
- **Statistical Calculations**: 
  - Average monthly spending per category
  - Coefficient of variation (CV) for spending consistency
  - Standard deviation for variance measurement
- **Trend Detection**: Identifies increasing spending patterns and overspending spikes

#### 🧠 Smart Buffering System
Based on spending behavior analysis:

| Spending Pattern | Buffer Applied | Feedback |
|------------------|----------------|----------|
| **Stable** (low variance) | +5% buffer | ✅ Spending is consistent. Minimal buffer added. |
| **Moderate variance** | +10% buffer | 📈 Moderate spending variation. Added buffer for monthly fluctuations. |
| **High variance** | +15% buffer | 📊 Spending is inconsistent. Added higher buffer for flexibility. |
| **Overspending detected** | +20% buffer | ⚠️ Detected increasing spending trend. Consider reducing expenses. |

#### 📊 Return Data Structure
Each category returns:
```javascript
{
  average: 1500,                    // Average monthly spending
  bufferedSuggestion: 1800,         // Suggested budget with buffer
  feedback: "📊 Spending is inconsistent...", // AI feedback message
  consistencyLevel: "moderate-variance", // Spending consistency
  coefficientOfVariation: 0.35,     // Statistical variance measure
  hasOverspending: false,           // Overspending detection
  monthlyData: [1200, 1800, 1500], // Monthly spending history
  monthsAnalyzed: 3                 // Number of months analyzed
}
```

## 🛠️ Technology Stack

- **Frontend**: React 18, TailwindCSS, Framer Motion
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── BudgetSettings.jsx      # Budget management interface
│   ├── Layout.jsx              # Main layout wrapper
│   ├── Navbar.jsx              # Navigation component
│   └── ...
├── pages/
│   ├── SmartBudgetPage.jsx     # Smart budget suggestions page
│   ├── OverviewPage.jsx        # Dashboard overview
│   ├── TransactionsPage.jsx    # Transaction history
│   ├── AddExpensePage.jsx      # Expense entry form
│   └── ...
├── store/
│   ├── budgetStore.js          # Budget state management
│   ├── expenseStore.js         # Expense state management
│   └── ...
├── utils/
│   └── budgetSuggestions.js    # Smart budget analysis logic
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd SpendSmart

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. **Add Expenses**: Navigate to "Add Expense" to manually enter your expenses
2. **View Smart Suggestions**: Go to "Smart Budget" to see AI-powered budget recommendations
3. **Apply Suggestions**: Use "Apply All" to set all suggested budgets at once
4. **Track Progress**: Monitor your spending against budgets in the dashboard

### Demo Mode
- If you don't have expense data, use the "Try Demo Data" button to see how the smart suggestions work
- Demo data generates realistic spending patterns across 5 categories over 6 months

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark interface with subtle gradients
- **Glassmorphism**: iOS-style glassy buttons and cards
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Interactive Charts**: Visual spending trends and budget progress

## 📊 Smart Analysis Features

### Spending Pattern Recognition
- **Consistency Analysis**: Identifies stable vs. variable spending patterns
- **Trend Detection**: Spots increasing spending trends
- **Anomaly Detection**: Flags unusual spending spikes
- **Seasonal Patterns**: Accounts for monthly variations

### Visual Insights
- **Monthly Spending Charts**: Mini bar charts showing spending trends
- **Consistency Indicators**: Color-coded consistency levels
- **Trend Icons**: Visual indicators for spending direction
- **Progress Bars**: Budget utilization tracking

## 🔧 Customization

### Adding New Categories
Edit the categories array in `BudgetSettings.jsx`:
```javascript
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
  // Add your custom categories here
];
```

### Adjusting Buffer Percentages
Modify the buffering logic in `budgetSuggestions.js`:
```javascript
if (hasOverspending) {
  buffer = 0.20; // 20% buffer for overspending
} else if (cv > 0.5) {
  buffer = 0.15; // 15% buffer for high variance
} else if (cv > 0.3) {
  buffer = 0.10; // 10% buffer for moderate variance
} else {
  buffer = 0.05; // 5% buffer for stable spending
}
```

## 📈 Performance Features

- **Local Storage**: All data persists locally in the browser
- **Efficient Analysis**: Optimized algorithms for real-time calculations
- **Lazy Loading**: Components load only when needed
- **Memoization**: Smart caching of analysis results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React patterns and best practices
- Inspired by modern fintech applications
- Uses statistical analysis for intelligent budget recommendations
