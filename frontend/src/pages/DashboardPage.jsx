import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: "",
    amount: "",
    description: "",
    category: "",
    date: "",
  });
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate(); // Use navigate to programmatically navigate to login page

  // Categories for expense and income
  const expenseCategories = [
    "Food",
    "Grocery",
    "Transport",
    "Entertainment",
    "Utilities",
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investment",
    "Passive Income",
    "Other Income",
  ];

  // Fetch transactions based on the filter
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://moneybuddy.onrender.com/api/v1/transactions/lists",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const data = response.data;

        // Apply filters
        if (filter === "today") {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to ignore the time part
          setTransactions(
            data.filter((t) => new Date(t.date).toDateString() === today.toDateString())
          );
        } else if (filter === "thisWeek") {
          const today = new Date();
          const thisWeekStart = new Date(today);
          const thisWeekEnd = new Date(today);
        
          // Set lastWeekStart to the previous Monday
          thisWeekStart.setDate(today.getDate() - today.getDay()); // Monday of this week
          thisWeekStart.setHours(0, 0, 0, 0); // Normalize time to midnight
        
          // Set lastWeekEnd to the previous Sunday
          thisWeekEnd.setDate(today.getDate() - today.getDay() +6); // Sunday of this week
          thisWeekEnd.setHours(23, 59, 59, 999); // Set to the end of the day
        
          setTransactions(
            data.filter((t) => {
              const transactionDate = new Date(t.date);
              return transactionDate >= thisWeekStart && transactionDate <= thisWeekEnd;
            })
          );
        }else if (filter === "lastWeek") {
          const today = new Date();
          const lastWeekStart = new Date(today);
          const lastWeekEnd = new Date(today);
        
          // Set lastWeekStart to the previous Monday
          lastWeekStart.setDate(today.getDate() - today.getDay() - 6); // Monday of last week
          lastWeekStart.setHours(0, 0, 0, 0); // Normalize time to midnight
        
          // Set lastWeekEnd to the previous Sunday
          lastWeekEnd.setDate(today.getDate() - today.getDay() - 1); // Sunday of last week
          lastWeekEnd.setHours(23, 59, 59, 999); // Set to the end of the day
        
          setTransactions(
            data.filter((t) => {
              const transactionDate = new Date(t.date);
              return transactionDate >= lastWeekStart && transactionDate <= lastWeekEnd;
            })
          );
        } else if (filter === "lastMonth") {
          const today = new Date();
          const lastMonthStart = new Date();
          lastMonthStart.setMonth(today.getMonth() - 1); // Get the date 1 month ago
          lastMonthStart.setDate(1); // Set to the first day of the month
          lastMonthStart.setHours(0, 0, 0, 0); // Normalize time to midnight
          const lastMonthEnd = new Date();
          lastMonthEnd.setDate(1); // Set to the first day of the current month
          lastMonthEnd.setHours(0, 0, 0, 0); // Normalize time to midnight

          setTransactions(
            data.filter((t) => {
              const transactionDate = new Date(t.date);
              return transactionDate >= lastMonthStart && transactionDate < lastMonthEnd;
            })
          );
        } else {
          setTransactions(data); // No filter, show all transactions
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching transactions!");
      }
    };

    fetchTransactions();
  }, [filter]);

 // Add a new transaction
const handleAddTransaction = async (e) => {
  e.preventDefault();

  // Validate required fields
  if (
    !newTransaction.amount ||
    !newTransaction.type ||
    !newTransaction.date ||
    !newTransaction.category
  ) {
    alert("Please fill out all required fields.");
    return;
  }

  // Normalize category to lowercase before sending to API
  const transactionData = {
    ...newTransaction,
    category: newTransaction.category.trim().toLowerCase(), // Normalize category
    amount: parseFloat(newTransaction.amount), // Ensure amount is a number
    date: new Date(newTransaction.date).toISOString(), // Convert date to ISO string
  };

  try {
    // Send the request to create the transaction
    const response = await axios.post(
      "https://moneybuddy.onrender.com/api/v1/transactions/create",
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is set
        },
      }
    );

    // Add the new transaction to the top of the list
    setTransactions((prev) => [response.data, ...prev]);

    // Reset the form after success
    setNewTransaction({
      type: "",
      amount: "",
      description: "",
      category: "",
      date: "",
    });

    // alert("Transaction added successfully!");
  } catch (error) {
    console.error("Error adding transaction:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred.";
    alert(`Error adding transaction: ${errorMessage}`);
  }
};

  // Delete a transaction
  const handleDeleteTransaction = async (transactionId) => {
    // Optimistically update the UI by removing the transaction immediately
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction._id !== transactionId)
    );

    try {
      // Make the DELETE request
      const response = await axios.delete(
        `https://moneybuddy.onrender.com/api/v1/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is passed
          },
        }
      );
      console.log("Transaction deleted:", response.data);
      //alert("Transaction removed successfully!"); // Show success message
    } catch (error) {
      // If the request fails, restore the deleted transaction back into the state
      console.error("Error deleting transaction:", error);
      alert("Error deleting transaction");

      // Optionally, you can restore the transaction if you want to cancel the deletion on error
      // setTransactions((prevTransactions) => [...prevTransactions, deletedTransaction]);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div className=" h-screen bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
      <h1 className="text-5xl font-bold text-red-500 text-center">MoneyBuddy</h1>
    <div className="container mx-auto p-6">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-red-600 to-red-200 text-white py-3 px-4 rounded-lg mb-6 flex justify-between items-center shadow-black shadow-md">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Link
            to="/profile"
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            to="/reports"
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-gray-100"
          >
            Reports
          </Link>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <label className="text-white font-medium mr-4">
          Filter Transactions:
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      {/* Add Transaction Form */}
      <form
        onSubmit={handleAddTransaction}
        className="bg-white p-6 rounded-lg shadow-black shadow-2xl mb-6"
      >
        <div className="flex flex-wrap gap-4 ">
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            className="p-2 border border-gray-300 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                description: e.target.value,
              })
            }
            className="p-2 border border-gray-300 rounded flex-1"
          />
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          />

          {/* Transaction Type Dropdown */}
          <select
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category Dropdown based on type */}
          <select
            value={newTransaction.category}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {(newTransaction.type === "expense" ? expenseCategories : incomeCategories).map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </form>

      {/* Transactions Table */}
      
<div className="bg-white p-6 rounded-lg shadow-black shadow-xl">
  <div className="max-h-96 overflow-y-auto"> {/* Set max height and enable scrolling */}
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Amount</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Actions</th> {/* Added column for actions */}
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction._id} className="border-b hover:bg-gray-100">
            <td className="px-4 py-2">{transaction.description}</td>
            <td className="px-4 py-2">{transaction.amount}</td>
            <td className="px-4 py-2">
              {new Date(transaction.date).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">
              {transaction.category || "Uncategorized"}
            </td>
            <td className="px-4 py-2">{transaction.type}</td>
            <td className="px-4 py-2">
              <button
                onClick={() => handleDeleteTransaction(transaction._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </div>
    </div>
  );
};

export default Dashboard;
