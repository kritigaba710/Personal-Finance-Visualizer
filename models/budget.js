// models/budget.js
import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities', 'Healthcare', 'Other'],
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
export default Budget;