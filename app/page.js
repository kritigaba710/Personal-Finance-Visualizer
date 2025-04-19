"use client";
import Image from "next/image";
import { useState,useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import BudgetTracker from "./components/BudgetTracker";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import CategoryChart from "./components/CategoryChart";
import BudgetComparisonChart from "./components/BudgetComparisonChart";
import TransactionChart from "./components/TransactionChart";
export default function Home() {
  
  const [newTransaction, setNewTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [editTxn, setEditTxn] = useState(null);
  const [updatedTxn, setUpdatedTxn] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const handleAddOrUpdate = () => {
    fetchTransactions(); // Refresh after changes
    setEditTxn(null);
  };
  
  return (
    <div className="bg-[#d0e7dd] pb-6">
      <Navbar />
      <div className="bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl bg-clip-text text-transparent text-5xl font-bold text-center">Your Personal Finance Visualizer</div>
      <div className="p-6">
        <Dashboard />
      </div>
      <div className="py-6">
        <BudgetTracker />
      </div>
      <div className="py-6">
        <div className="bg-gradient-to-r from-[#6b5a8a] via-[#6959a1e8] to-[#506399] bg-clip-text text-transparent text-5xl font-bold text-center mb-2">Add New Transaction</div>
        <TransactionForm
          onAdd={setNewTransaction}
          editTxn={editTxn}
          onUpdate={(txn) => {
            setUpdatedTxn(txn);
            setEditTxn(null);
          }
        }
        onSuccess={handleAddOrUpdate}
        />
      </div>
      <div className="py-6">
        <div className="bg-gradient-to-r from-[#6b5a8a] via-[#6959a1e8] to-[#506399] bg-clip-text text-transparent text-5xl font-bold text-center mb-2">Transaction List</div>
        <TransactionList
          transactions={transactions}
          newTransaction={newTransaction}
          updatedTransaction={updatedTxn}
          onEdit={setEditTxn}
          onDelete={fetchTransactions}
        />
      </div>
      <div className="py-6">
        <TransactionChart transactions={transactions}/>
        <CategoryChart />
        <BudgetComparisonChart />
      </div>
    </div>

  );
}
