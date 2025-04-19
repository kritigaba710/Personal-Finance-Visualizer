"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState,useEffect } from "react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

export default function CategoryChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((transactions) => {
        const categoryData = transactions.reduce((acc, txn) => {
          const category = txn.category || 'Other';
          acc[category] = (acc[category] || 0) + txn.amount;
          return acc;
        }, {});

        setData(Object.keys(categoryData).map(category => ({
          name: category,
          value: categoryData[category]
        })));
      });
  }, []);

  return (
    <div className="w-full h-72 mt-20">
      <h2 className="text-4xl text-center font-bold mb-4">Expense Categories</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}