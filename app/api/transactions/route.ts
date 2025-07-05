import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("personal-finance")
    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, date, description, category } = body

    // Validation
    if (!amount || !date || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("personal-finance")

    const transaction = {
      amount: Number.parseFloat(amount),
      date: new Date(date),
      description: description.trim(),
      category,
      createdAt: new Date(),
    }

    const result = await db.collection("transactions").insertOne(transaction)

    return NextResponse.json({
      _id: result.insertedId,
      ...transaction,
    })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
