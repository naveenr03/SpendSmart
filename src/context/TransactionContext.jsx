import { createContext, useContext, useEffect, useState } from 'react'

const TransactionContext = createContext()

export const useTransactions = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return context
}

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([])

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(), // Simple unique ID
      createdAt: new Date().toISOString()
    }
    setTransactions(prev => [...prev, newTransaction])
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id))
  }

  const updateTransaction = (id, updatedData) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updatedData, updatedAt: new Date().toISOString() }
          : transaction
      )
    )
  }

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
} 