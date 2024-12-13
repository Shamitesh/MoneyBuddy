const asyncHandler = require("express-async-handler");
const Transaction = require("../model/transaction.model");
const mongoose = require("mongoose");

const transactionController = {
  /**
   * Create a new transaction
   */
  create: asyncHandler(async (req, res) => {
    try {
      const { type, amount, description, date, category } = req.body;
  
      // Normalize category to lowercase
      const normalizedCategory = category.toLowerCase();
  
    //  console.log("Received type:", type);        
      //console.log("Received category:", normalizedCategory);
  
      const expenseCategories = ["food", "grocery", "transport", "entertainment", "utilities"];
      const incomeCategories = ["salary", "freelance", "investment", "passive income", "other income"];
  
      // Validate category based on type
      if (type === "expense" && !expenseCategories.includes(normalizedCategory)) {
        return res.status(400).json({ message: "Invalid expense category." });
      }
      if (type === "income" && !incomeCategories.includes(normalizedCategory)) {
        return res.status(400).json({ message: "Invalid income category." });
      }
  
      // Creating the new transaction
      const newTransaction = new Transaction({
        type,
        user: req.user._id,
        amount,
        description,
        date,
        category: normalizedCategory,  // Save the normalized category
      });
  
      // Save the new transaction to the database
      await newTransaction.save();
  
      // Respond with the new transaction
      res.status(201).json(newTransaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(400).json({ message: "Error creating transaction." });
    }
  }),
  
  
  /**
   * Get transactions with optional filtering by date, type, and category
   */
  getFilteredTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    let filters = { user: req.user };

    // Handle date filtering
    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }

    // Handle type filtering
    if (type) {
      filters.type = type;
    }

    // Handle category filtering
    if (category && category !== "All") {
      filters.category = category; // No need to query Category model if categories are strings
    }

    // Fetch the transactions based on filters
    const transactions = await Transaction.find(filters)
      .sort({ date: -1 });  // Sort by date in descending order

    res.json(transactions);
  }),

  /**
   * Update a transaction by ID
   */
  update: asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Ensure the user is authorized to update this transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this transaction" });
    }

    // Update the transaction fields
    transaction.type = req.body.type || transaction.type;
    transaction.category = req.body.category || transaction.category;
    transaction.amount = req.body.amount || transaction.amount;
    transaction.date = req.body.date || transaction.date;
    transaction.description = req.body.description || transaction.description;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  }),

  /**
   * Delete a transaction by ID
   */
  delete: asyncHandler(async (req, res) => {
    // Find the transaction by its ID
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Ensure the user is authorized to delete this transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this transaction" });
    }

    // Delete the transaction
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction removed" });
  }),
};

module.exports = transactionController;
