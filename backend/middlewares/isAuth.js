const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const isAuthenticated = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get the token from the header
      token = req.headers.authorization.split(" ")[1]; // Extract the token part after "Bearer"

      // Verify the token with the secret key
      const decoded = jwt.verify(token, "meamitaurtum"); // Replace with your JWT secret

      // Attach the user data to the request object (without password)
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = isAuthenticated;
