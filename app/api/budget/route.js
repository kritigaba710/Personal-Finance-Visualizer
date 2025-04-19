// app/api/budget/route.js
import { connectToDB } from "@/lib/mongodb";
import Budget from "@/models/budget";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const budgets = await Budget.find();
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching budgets" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { category, amount } = await req.json();
    await connectToDB();
    
    const budget = await Budget.findOneAndUpdate(
      { category },
      { amount },
      { upsert: true, new: true }
    );
    
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error setting budget" }, { status: 500 });
  }
}