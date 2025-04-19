"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [summary, setSummary] = useState({
        totalExpenses: 0,
        categoryBreakdown: {},
        recentTransactions: []
    });

    useEffect(() => {
        Promise.all([
            fetch("/api/transactions"),
            fetch("/api/budget")
        ])
            .then(([transRes, budgetRes]) => Promise.all([transRes.json(), budgetRes.json()]))
            .then(([transactions, budgets]) => {
                const total = transactions.reduce((sum, txn) => sum + txn.amount, 0);

                const breakdown = transactions.reduce((acc, txn) => {
                    const category = txn.category;
                    acc[category] = (acc[category] || 0) + txn.amount;
                    return acc;
                }, {});
                const insights = budgets.map(budget => {
                    const spent = transactions
                        .filter(txn => txn.category === budget.category)
                        .reduce((sum, txn) => sum + txn.amount, 0);
                    return {
                        category: budget.category,
                        budget: budget.amount,
                        spent,
                        percentage: (spent / budget.amount) * 100
                    };
                });

                setSummary({
                    totalExpenses: total,
                    categoryBreakdown: breakdown,
                    recentTransactions: transactions.slice(0, 5),
                    budgetInsights: insights
                });
            });
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 text-gray-900 gap-8 mb-8">
            <div className="border p-4 rounded border-gray-900">
                <h3 className=" text-center font-semibold">Total Expenses</h3>
                <p className="text-2xl text-center">₹{summary.totalExpenses.toFixed(2)}</p>
            </div>

            <div className="border p-4 rounded border-gray-900">
                <h3 className="font-semibold mb-2 text-center">Category Breakdown</h3>
                <ul className="space-y-1">
                    {Object.entries(summary.categoryBreakdown).map(([category, amount]) => (
                        <li key={category} className="flex justify-between">
                            <span>{category}</span>
                            <span>₹{amount.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border p-4 rounded border-gray-900">
                <h3 className="font-semibold mb-2 text-center px-5">Recent Transactions</h3>
                <ul className="space-y-2">
                    {summary.recentTransactions.map(txn => (
                        <li key={txn._id} className="flex justify-between">
                            <span>{txn.description}</span>
                            <span>₹{txn.amount.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border p-4 rounded border-gray-900">
                <h3 className="font-semibold mb-2 text-center">Budget Insights</h3>
                <ul className="space-y-2">
                    {summary.budgetInsights?.map(insight => (
                        <li key={insight.category}>
                            <div className="flex justify-between">
                                <span>{insight.category}</span>
                                <span className={insight.percentage > 100 ? 'text-red-500' : ''}>
                                    {insight.percentage.toFixed(0)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className={`h-1.5 rounded-full ${insight.percentage > 100 ? 'bg-red-500' : 'bg-blue-500'
                                        }`}
                                    style={{ width: `${Math.min(insight.percentage, 100)}%` }}
                                ></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}