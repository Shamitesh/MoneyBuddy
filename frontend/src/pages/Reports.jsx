import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState({ income: [], expense: [] });
  const [categoryData, setCategoryData] = useState({ income: {}, expense: {} });
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/transactions/lists', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = response.data;
        setTransactions(data);
        processData(data);
      } catch (error) {
        console.error(error);
        alert('Error fetching transactions!');
      }
    };

    fetchTransactions();
  }, []);

  // Process the fetched data to segregate monthly and category-wise income/expenses
  const processData = (data) => {
    const incomeData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);
    const categoryIncome = {};
    const categoryExpense = {};

    data.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.getMonth();
      const categoryName = transaction.category || 'Uncategorized';  // Adjusted category handling

      // Income processing
      if (transaction.type === 'income') {
        incomeData[month] += transaction.amount;
        categoryIncome[categoryName] = (categoryIncome[categoryName] || 0) + transaction.amount;
      } 
      // Expense processing
      else if (transaction.type === 'expense') {
        expenseData[month] += transaction.amount;
        categoryExpense[categoryName] = (categoryExpense[categoryName] || 0) + transaction.amount;
      }
    });

    setMonthlyData({ income: incomeData, expense: expenseData });
    setCategoryData({ income: categoryIncome, expense: categoryExpense });
  };

  // Data for the monthly Income vs Expense bar chart
  const barData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    datasets: [
      {
        label: 'Income',
        data: monthlyData.income,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expense',
        data: monthlyData.expense,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Data for the pie chart showing income by category
  const pieIncomeData = {
    labels: Object.keys(categoryData.income),
    datasets: [
      {
        label: 'Income by Category',
        data: Object.values(categoryData.income),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  // Data for the pie chart showing expense by category
  const pieExpenseData = {
    labels: Object.keys(categoryData.expense),
    datasets: [
      {
        label: 'Expense by Category',
        data: Object.values(categoryData.expense),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  // Back button handler
  const handleBack = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
  };

  return (
    <div className="bg-gradient-to-r from-red-400 to-red-200">
      <div className="container mx-auto p-4">
        <h1 className="text-white text-2xl font-bold mb-6">Reports</h1>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        >
          Back to Dashboard
        </button>

        {/* Monthly Income/Expense Bar Chart */}
        <div className="bg-white p-4 rounded shadow-black shadow-2xl mb-6">
          <h2 className="text-lg font-medium mb-4">Monthly Income vs. Expenses</h2>
          <Bar data={barData} options={{ responsive: true }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Income by Category Pie Chart */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-medium mb-4">Income by Category</h2>
            <Pie data={pieIncomeData} options={{ responsive: true }} />
          </div>

          {/* Expense by Category Pie Chart */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-medium mb-4">Expense by Category</h2>
            <Pie data={pieExpenseData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
