"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { Transaction, Budget } from "@/types"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"

interface BudgetComparisonProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export default function BudgetComparison({ transactions, budgets }: BudgetComparisonProps) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentMonthBudgets = budgets.filter((b) => b.month === currentMonth)

  if (currentMonthBudgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
          <CardDescription>Compare your spending against your budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No budgets set for this month. Set a budget to track your spending!
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate actual spending by category
  const actualSpending = transactions.reduce(
    (acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    },
    {} as Record<string, number>,
  )

  // Prepare chart data
  const chartData = currentMonthBudgets.map((budget) => ({
    category: budget.category,
    budget: budget.amount,
    actual: actualSpending[budget.category] || 0,
    percentage: ((actualSpending[budget.category] || 0) / budget.amount) * 100,
  }))

  // Calculate insights
  const totalBudget = currentMonthBudgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = chartData.reduce((sum, item) => sum + item.actual, 0)
  const overBudgetCategories = chartData.filter((item) => item.actual > item.budget)
  const underBudgetCategories = chartData.filter((item) => item.actual <= item.budget * 0.8)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
          <CardDescription>
            Compare your spending against your budgets for{" "}
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              budget: {
                label: "Budget",
                color: "hsl(var(--chart-1))",
              },
              actual: {
                label: "Actual",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name === "budget" ? "Budget" : "Actual"]}
                />
                <Bar dataKey="budget" fill="var(--color-budget)" name="Budget" />
                <Bar dataKey="actual" fill="var(--color-actual)" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Budget Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.map((item) => (
          <Card key={item.category}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{item.category}</h3>
                {item.actual > item.budget ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>${item.actual.toFixed(2)} spent</span>
                  <span>${item.budget.toFixed(2)} budget</span>
                </div>
                <Progress value={Math.min(item.percentage, 100)} className="h-2" />
                <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}% of budget used</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Spending Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
              <div className="text-xs mt-1">{((totalSpent / totalBudget) * 100).toFixed(1)}% of total budget</div>
            </div>

            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{overBudgetCategories.length}</div>
              <div className="text-sm text-muted-foreground">Over Budget</div>
              {overBudgetCategories.length > 0 && (
                <div className="text-xs mt-1">{overBudgetCategories.map((c) => c.category).join(", ")}</div>
              )}
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{underBudgetCategories.length}</div>
              <div className="text-sm text-muted-foreground">Under Budget</div>
              {underBudgetCategories.length > 0 && (
                <div className="text-xs mt-1">{underBudgetCategories.map((c) => c.category).join(", ")}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
