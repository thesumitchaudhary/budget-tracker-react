import React, { useState, useEffect } from "react";
import './styles/middle.css';

function Middle() {
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Add new transaction
  function increamentDecreamentIncoome() {
    const num = parseFloat(amount);
    if (!text  || !amount || isNaN(num)) return;

    const newTransaction = {
      id: Date.now(),
      text: text,
      amount: num,
    };

    setTransactions(prev => [...prev, newTransaction]);
    setAmount(""); // clear input
    setText(""); // clear input
  }

  // Delete a transaction
  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }

  // Calculations
  const totalIncome = transactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome + totalExpense;

  return (
    <main>
      <div className="balance-sheet">
        <div>
          <p>Income</p>
          <p>${totalIncome}</p>
        </div>
        <div>
          <p>Expenses</p>
          <p>${Math.abs(totalExpense)}</p>
        </div>
        <div>
          <p>Balance</p>
          <p>${balance}</p>
        </div>
      </div>

      <div className="two-column-layout">
        <div>
          <h2>Income</h2>
          <div className="donut-chart">
            <div className="donut-hole"></div>
          </div>
          <ul className="legend">
            <li><span className="shopping"></span>video Editing</li>
            <li><span className="food"></span>Website developing</li>
            <li><span className="other"></span>Other</li>
          </ul>
        </div>

         <div>
          <h2>Expenses</h2>
          <div className="donut-chart">
            <div className="donut-hole"></div>
          </div>
          <ul className="legend">
            <li><span className="shopping"></span>Shopping</li>
            <li><span className="food"></span>Food</li>
            <li><span className="other"></span>Other</li>
          </ul>
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
            <select>
              <option>Shopping</option>
              <option>Food</option>
              <option>Ticket Booking</option>
              <option>Video Editing</option>
              <option>Website Developing</option>
            </select>
            <button className="add-trasaction" onClick={increamentDecreamentIncoome}>
              Add Transaction
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3>All Transactions</h3>
        <div className="two-column-layout">
          <div>
            <h4>Income List</h4>
            <ul>
              {transactions
                .filter(tx => tx.amount > 0)
                .map(tx => (
                  <li key={tx.id} style={{ marginBottom: "10px" }}>
                    {tx.text} — ${tx.amount}
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
              {transactions
                .filter(tx => tx.amount < 0)
                .map(tx => (
                  <li key={tx.id} style={{ marginBottom: "10px" }}>
                    {tx.text} — ${Math.abs(tx.amount)}
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
