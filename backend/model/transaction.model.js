const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Type is required"],  // Ensure 'type' is required
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],  // Ensure 'user' is required
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],  // Ensure amount is provided
    },
    description: String,
    date: {
      type: Date,
      required: [true, "Date is required"],  // Ensure date is provided
    },
    category: {
      type: String,
      required: [true, "Category is required"],  // Ensure category is provided
      validate: {
        validator: function (value) {
          // Validate category based on type
          if (this.type === "expense") {
            const validExpenseCategories = [
              "food", "grocery", "transport", "entertainment", "utilities"
            ];
            return validExpenseCategories.includes(value);
          }
          if (this.type === "income") {
            const validIncomeCategories = [
              "salary", "freelance", "investment", "passive income", "other income"
            ];
            return validIncomeCategories.includes(value);
          }
          return false;
        },
        message: "Invalid category for the given type"
      }
    }
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
