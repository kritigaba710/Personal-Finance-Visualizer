//components/TransactionList.js
import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";

export default function TransactionList({ newTransaction, onEdit, updatedTransaction }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  useEffect(() => {
    if (newTransaction) {
      setTransactions((prev) => [newTransaction, ...prev]);
    }
  }, [newTransaction]);

  useEffect(() => {
    if (updatedTransaction) {
      setTransactions((prev) =>
        prev.map((txn) =>
          txn._id === updatedTransaction._id ? updatedTransaction : txn
        )
      );
    }
  }, [updatedTransaction]);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setTransactions((prev) => prev.filter((txn) => txn._id !== id));
    } else {
      alert("Failed to delete transaction.");
    }
  };

  return (
    <div className="mt-6 space-y-2">
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((txn) => (
            <li
              key={txn._id}
              className="p-3 border rounded flex justify-between items-center border-gray-500"
            >
              <div>
                <p className="font-medium">{txn.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(txn.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">₹{txn.amount}</span>
                <button onClick={() => onEdit(txn)} title="Edit" className="text-blue-600">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(txn._id)} title="Delete" className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
