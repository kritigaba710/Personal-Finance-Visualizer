// app/api/transactions/route.js
import { connectToDB } from "@/lib/mongodb";
import Transaction from "@/models/transaction";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Incoming POST data:", body); 
    const { amount, description, date, category} = body;

    await connectToDB();
    const newTransaction = await Transaction.create({ amount, description, date, category});

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json({ message: "Error creating transaction" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const transactions = await Transaction.find().sort({ date: -1 });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json({ message: "Error fetching transactions" }, { status: 500 });
  }
}
export async function DELETE(req) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
  
      if (!id) {
        return NextResponse.json({ message: "Transaction ID required" }, { status: 400 });
      }
  
      await connectToDB();
      await Transaction.findByIdAndDelete(id);
  
      return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
    } catch (error) {
      console.error("DELETE /api/transactions error:", error);
      return NextResponse.json({ message: "Error deleting transaction" }, { status: 500 });
    }
  }
  export async function PATCH(req) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      const body = await req.json();
      console.log("Incoming PATCH data:", body);
      await connectToDB();
      const updatedTxn = await Transaction.findByIdAndUpdate(id, body, { new: true });
  
      return NextResponse.json(updatedTxn);
    } catch (error) {
      console.error("PATCH /api/transactions error:", error);
      return NextResponse.json({ message: "Error updating transaction" }, { status: 500 });
    }
  }
  
  
