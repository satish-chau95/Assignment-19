"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign, TrendingUp, Calendar } from "lucide-react"
import TransactionForm from "./transaction-form"
import TransactionList from "./transaction-list"
import MonthlyExpensesChart from "./monthly-expenses-chart"
import CategoryPieChart from "./category-pie-chart"
import BudgetComparison from "./budget-comparison"
import BudgetForm from "./budget-form"
import type { Transaction, Budget } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTransactions()
    fetchBudgets()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets")
      if (response.ok) {
        const data = await response.json()
        setBudgets(data)
      }
    } catch (error) {
      console.error("Failed to fetch budgets:", error)
    }
  }

  const handleTransactionSubmit = async (transactionData: Omit<Transaction, "_id">) => {
    try {
      const url = editingTransaction ? `/api/transactions/${editingTransaction._id}` : "/api/transactions"
      const method = editingTransaction ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      })

      if (response.ok) {
        await fetchTransactions()
        setShowTransactionForm(false)
        setEditingTransaction(null)
        toast({
          title: "Success",
          description: `Transaction ${editingTransaction ? "updated" : "added"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTransactions()
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  const handleBudgetSubmit = async (budgetData: Omit<Budget, "_id">) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetData),
      })

      if (response.ok) {
        await fetchBudgets()
        setShowBudgetForm(false)
        toast({
          title: "Success",
          description: "Budget set successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set budget",
        variant: "destructive",
      })
    }
  }

  // Calculate summary statistics
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const totalExpenses = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0)
  const transactionCount = currentMonthTransactions.length
  const mostRecentTransaction = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

  // Category breakdown
  const categoryTotals = currentMonthTransactions.reduce(
    (acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Personal Finance Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowBudgetForm(true)} variant="outline">
            Set Budget
          </Button>
          <Button onClick={() => setShowTransactionForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses (This Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{transactionCount} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCategory ? topCategory[0] : "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {topCategory ? `$${topCategory[1].toFixed(2)}` : "No expenses yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Transaction</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostRecentTransaction ? `$${mostRecentTransaction.amount.toFixed(2)}` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostRecentTransaction ? mostRecentTransaction.description : "No transactions yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyExpensesChart transactions={transactions} />
        <CategoryPieChart transactions={currentMonthTransactions} />
      </div>

      {/* Budget Comparison */}
      <BudgetComparison transactions={currentMonthTransactions} budgets={budgets} />

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        onEdit={(transaction) => {
          setEditingTransaction(transaction)
          setShowTransactionForm(true)
        }}
        onDelete={handleDeleteTransaction}
      />

      {/* Forms */}
      {showTransactionForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={handleTransactionSubmit}
          onCancel={() => {
            setShowTransactionForm(false)
            setEditingTransaction(null)
          }}
        />
      )}

      {showBudgetForm && <BudgetForm onSubmit={handleBudgetSubmit} onCancel={() => setShowBudgetForm(false)} />}
    </div>
  )
}
