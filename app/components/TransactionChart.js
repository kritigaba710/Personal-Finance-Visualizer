"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function TransactionChart({ transactions }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((transactions) => {
        const monthlyData = transactions.reduce((acc, txn) => {
          const date = new Date(txn.date);
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          
          if (!acc[monthYear]) {
            acc[monthYear] = 0;
          }
          acc[monthYear] += txn.amount;
          
          return acc;
        }, {});

        const sortedData = Object.entries(monthlyData)
          .map(([monthYear, amount]) => ({ monthYear, amount }))
          .sort((a, b) => {
            const [aMonth, aYear] = a.monthYear.split(' ');
            const [bMonth, bYear] = b.monthYear.split(' ');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return aYear !== bYear 
              ? aYear - bYear 
              : months.indexOf(aMonth) - months.indexOf(bMonth);
          });

        setData(sortedData);
      });
  }, []);

  return (
    <div className="w-full h-80 mt-16">
      <h2 className="text-4xl font-bold text-center mb-4">Monthly Spending Trends</h2>
      <ResponsiveContainer width="50%" height="100%" className="mx-auto">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="monthYear" 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`₹${value}`, "Total Spending"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Bar 
            dataKey="amount" 
            fill="#3b82f6" 
            name="Total Spending"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}