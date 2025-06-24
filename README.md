# SpendWise+ - Smart Personal Finance App

A modern, full-stack personal finance web application with AI-powered budget suggestions and comprehensive expense tracking.

## 🚀 Features

### Core Features
- **Smart Budget Suggestions** - AI-powered budget recommendations based on spending patterns
- **Expense Tracking** - Manual expense entry with categorization
- **Dashboard Analytics** - Visual charts and spending insights
- **Budget Management** - Set and track monthly budget limits
- **Transaction History** - Complete expense history with filtering

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


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

