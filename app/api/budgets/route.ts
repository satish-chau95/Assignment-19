import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("personal-finance")
    const budgets = await db.collection("budgets").find({}).sort({ month: -1 }).toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, amount, month } = body

    // Validation
    if (!category || !amount || !month) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("personal-finance")

    // Check if budget already exists for this category and month
    const existingBudget = await db.collection("budgets").findOne({
      category,
      month,
    })

    if (existingBudget) {
      // Update existing budget
      const result = await db.collection("budgets").updateOne(
        { category, month },
        {
          $set: {
            amount: Number.parseFloat(amount),
            updatedAt: new Date(),
          },
        },
      )

      return NextResponse.json({
        _id: existingBudget._id,
        category,
        amount: Number.parseFloat(amount),
        month,
      })
    } else {
      // Create new budget
      const budget = {
        category,
        amount: Number.parseFloat(amount),
        month,
        createdAt: new Date(),
      }

      const result = await db.collection("budgets").insertOne(budget)

      return NextResponse.json({
        _id: result.insertedId,
        ...budget,
      })
    }
  } catch (error) {
    console.error("Error creating/updating budget:", error)
    return NextResponse.json({ error: "Failed to save budget" }, { status: 500 })
  }
}
