const express = require("express");
const usersController = require("../controllers/user.controller");
const isAuthenticated = require("../middlewares/isAuth");
const transactionController = require("../controllers/transaction.controller");
const transactionRouter = express.Router();

//!add
transactionRouter.post(
  "/transactions/create",
  isAuthenticated,
  transactionController.create
);
//! lists
transactionRouter.get(
  "/transactions/lists",
  isAuthenticated,
  transactionController.getFilteredTransactions
);
//! update
transactionRouter.put(
  "/transactions/update/:id",
  isAuthenticated,
  transactionController.update
);
//! delete
transactionRouter.delete(
  "/transactions/:id",  // Simplified to follow RESTful conventions
  isAuthenticated,       // Authentication middleware
  transactionController.delete  // Controller method for deleting a transaction
);

module.exports = transactionRouter;