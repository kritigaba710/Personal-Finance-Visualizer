// components/BudgetComparisonChart.js
"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function BudgetComparisonChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/budget").then(res => res.json()),
      fetch("/api/transactions").then(res => res.json())
    ]).then(([budgets, transactions]) => {
      const comparisonData = budgets.map(budget => {
        const spent = transactions
          .filter(txn => txn.category === budget.category)
          .reduce((sum, txn) => sum + txn.amount, 0);
        
        return {
          name: budget.category,
          budget: budget.amount,
          spent: spent
        };
      });
      setData(comparisonData);
    });
  }, []);

  return (
    <div className="w-full h-72 mt-14">
      <h2 className="text-xl font-semibold mb-4">Budget vs Actual Spending</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#8884d8" name="Budget" />
          <Bar dataKey="spent" fill="#82ca9d" name="Actual" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}