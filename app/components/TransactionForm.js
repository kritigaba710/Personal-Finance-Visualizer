//components/TransactionForm.js
"use client";

import { useEffect, useState } from "react";

export default function TransactionForm({ onAdd, editTxn, onUpdate }) {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("Other")

    // Autofill when editing
    useEffect(() => {
        if (editTxn) {
            setAmount(editTxn.amount);
            setDescription(editTxn.description);
            setDate(editTxn.date.split("T")[0]); // to match input type="date"
            setCategory(editTxn.category || "Other");
        }
    }, [editTxn]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const transaction = {
            amount: parseFloat(amount),
            description,
            date,
            category,
        };
        console.log("Submitting with category:", category);
        console.log("Submitting transaction:", transaction); 
        if (editTxn) {
            const res = await fetch(`/api/transactions?id=${editTxn._id}`, {
                method: "PATCH",
                body: JSON.stringify(transaction),
            });

            const data = await res.json();
            onUpdate(data); // notify parent
        } else {
            const res = await fetch("/api/transactions", {
                method: "POST",
                body: JSON.stringify(transaction),
            });

            const data = await res.json();
            onAdd(data); // notify parent
        }

        // Reset form
        setAmount("");
        setDescription("");
        setDate("");
        setCategory("")
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border-gray-800 rounded border">
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full border-gray-500 border rounded p-2"
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border-gray-500 border rounded p-2"
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full border-gray-500 border rounded p-2"
            />
            <select
                type='category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full border-gray-500 border rounded p-2"
            >
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Housing">Housing</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
            </select>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {editTxn ? "Update Transaction" : "Add Transaction"}
            </button>
        </form>
    );
}
