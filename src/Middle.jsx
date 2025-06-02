import React, { useState, useEffect } from "react";
import './styles/middle.css';
import { PieChart, Pie, Cell, Legend } from 'recharts';

function Middle() {
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction() {
    const num = parseFloat(amount);
    if (!text || !amount || isNaN(num)) return;

    const newTransaction = {
      id: Date.now(),
      text,
      amount: num,
      category
    };

    setTransactions(prev => [...prev, newTransaction]);
    setAmount("");
    setText("");
    setCategory("Shopping");
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }

  const totalIncome = transactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalIncome + totalExpense;

  const incomeByCategory = {};
  const expenseByCategory = {};

  transactions.forEach(tx => {
    const cat = tx.category || "Other";
    if (tx.amount > 0) {
      incomeByCategory[cat] = (incomeByCategory[cat] || 0) + tx.amount;
    } else {
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Math.abs(tx.amount);
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF'];

  const incomeData = Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }));
  const expenseData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  return (
    <main>
      <div className="balance-sheet">
        <div><p>Income</p><p>${totalIncome}</p></div>
        <div><p>Expenses</p><p>${Math.abs(totalExpense)}</p></div>
        <div><p>Balance</p><p>${balance}</p></div>
      </div>

      <div className="two-column-layout">
        <div>
          <h2>Income</h2>
          <PieChart width={300} height={300}>
            <Pie data={incomeData} cx={150} cy={150} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value">
              {incomeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>

        <div>
          <h2>Expenses</h2>
          <PieChart width={300} height={300}>
            <Pie data={expenseData} cx={150} cy={150} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value">
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>

        <div>
          <h2>Add New Transaction</h2>
          <div className="input-area">
            <input 
              type="text" 
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Source"
            />
            <input
              type="number"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              placeholder="Amount (e.g. 100 or -50)"
            />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option>Shopping</option>
              <option>Food</option>
              <option>Ticket Booking</option>
              <option>Video Editing</option>
              <option>Website Developing</option>
              <option>Sotware Developing</option>
              <option>other</option>
            </select>
            <button className="add-trasaction" onClick={addTransaction}>Add Transaction</button>
          </div>
        </div>
      </div>

      <div>
        <h3>All Transactions</h3>
        <div className="two-column-layout">
          <div>
            <h4>Income List</h4>
            <ul>
              {transactions.filter(tx => tx.amount > 0).map(tx => (
                <li key={tx.id} style={{ marginBottom: "10px" }}>
                  {tx.text} ({tx.category}) — ${tx.amount}
                  <button className="deleteTransaction" onClick={() => deleteTransaction(tx.id)} style={{ marginLeft: "10px" }}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Expense List</h4>
            <ul>
              {transactions.filter(tx => tx.amount < 0).map(tx => (
                <li key={tx.id} style={{ marginBottom: "10px" }}>
                  {tx.text} ({tx.category}) — ${Math.abs(tx.amount)}
                  <button className="deleteTransaction" onClick={() => deleteTransaction(tx.id)} style={{ marginLeft: "10px" }}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Middle;
