const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const userRouter = require("./routes/user.route");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const transactionRouter = require("./routes/transaction.route");
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-expenses')
  .then(() => console.log('DB connected'))
  .catch((e) => console.log(e));

// Middleware
app.use(cors());
app.use(express.json());

// Routes with /api/v1 prefix
app.use('/api/v1', userRouter); // All user routes will now start with /api/v1
app.use('/api/v1', transactionRouter); // All transaction routes will now start with /api/v1

// Error handler middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port.. ${PORT}`));
