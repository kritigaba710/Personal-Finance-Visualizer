// components/BudgetTracker.js
"use client";
import { useEffect, useState } from "react";

export default function BudgetTracker() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/budget").then(res => res.json()),
      fetch("/api/transactions").then(res => res.json())
    ]).then(([budgets, transactions]) => {
      setBudgets(budgets);
      setTransactions(transactions);
    });
  }, []);

  const handleBudgetChange = async (category, amount) => {
    const res = await fetch("/api/budget", {
      method: "POST",
      body: JSON.stringify({ category, amount })
    });
    const updatedBudget = await res.json();
    setBudgets(prev => 
      prev.some(b => b.category === category) 
        ? prev.map(b => b.category === category ? updatedBudget : b)
        : [...prev, updatedBudget]
    );
  };

  const getBudgetStatus = (category) => {
    const budget = budgets.find(b => b.category === category)?.amount || 0;
    const spent = transactions
      .filter(txn => txn.category === category)
      .reduce((sum, txn) => sum + txn.amount, 0);
      
    return {
      budget,
      spent,
      remaining: budget - spent,
      percentage: budget > 0 ? (spent / budget) * 100 : 0
    };
  };

  return (
    <div className="mt-8 py-2 bg-gray-800">
      <h2 className="text-5xl text-gray-400 font-bold text-center mb-4">Budget Tracker</h2>
      <div className="space-y-4 px-6 text-white">
        {['Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities', 'Healthcare', 'Other'].map(category => {
          const status = getBudgetStatus(category);
          return (
            <div key={category} className=" p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{category}</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={budgets.find(b => b.category === category)?.amount || ''}
                    onChange={(e) => handleBudgetChange(category, parseFloat(e.target.value))}
                    placeholder="Set budget"
                    className="w-24 border rounded p-1"
                  />
                  <span className="text-sm">
                    ₹{status.spent.toFixed(2)} / ₹{status.budget.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    status.percentage > 90 ? 'bg-red-500' : 
                    status.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(status.percentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">
                {status.remaining >= 0 
                  ? `₹${status.remaining.toFixed(2)} remaining` 
                  : `₹${Math.abs(status.remaining).toFixed(2)} over budget`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}