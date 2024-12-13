
const asyncHandler = require("express-async-handler")
const User = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// User Registration
const userController = {
    //register
    register: asyncHandler(async(req,res)=>{
        const {username,email, password} = req.body
        //console.log(req.body);
    // validate
      if(!username || !email || !password){
        throw new Error('Please fill all fields, all are required')
      }
       // check if user already exists
       const userExists = await User.findOne({email}) 
       if(userExists){
        throw new Error('User already exists')
       }

       // Hash the user password
       const salt = await bcrypt.genSalt(10)
       const hasedPassword = await bcrypt.hash(password, salt)

        // Create user and save into db 

        const userCreated = await User.create({
            email,
            username,
            password: hasedPassword,
        })
      // Send the response
      
      res.json({
        username: userCreated.username,
        email: userCreated.email,
        id: userCreated._id,
      })


       // res.json({message: "Register"})
    }),

  //LOgin
   
  login: asyncHandler(async(req,res)=>{
    // Get the user data 

    const {email,password} = req.body

    // check if email is valid 
    const  user = await User.findOne({email})
   if(!user){
    throw new Error('Invalid Login credentials')
   }

    // comapre the user password
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Invalid login credentials')
    }

    // Generate a token

    const token = jwt.sign({id:user._id}, 'meamitaurtum', {expiresIn: '30d',})
    // send the response

      res.json({
        message: 'Login Success',
        token,
        id: user._id,
        email: user.email,
        username: user.username,

      })
  }),

  // Profile 
profile: asyncHandler(async(req,res)=>{
  // Find the user
  const user = await User.findById(req.user)
  if(!user){
    throw new Error("User not found")

  }

  // send response 
  res.json({username: user.username,email:user.email})
}),


  // Change Password
changeUserPassword: asyncHandler(async (req, res) => {
  const { newPassword, currentPassword } = req.body;

  // Find the user from the token in the request header
  const user = await User.findById(req.user);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if the current password matches
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  // Hash the new password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update the password
  user.password = hashedPassword;
  await user.save();

  // Send response
  res.json({ message: 'Password changed successfully' });
}),


   updateUserProfile : asyncHandler(async (req, res) => {
    const { newUsername, newEmail } = req.body;
    
    // Find the user from the token in request header
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error('User not found');
    }
  
    // Check if the new username or email already exists
    if (newUsername) {
      const usernameExists = await User.findOne({ username: newUsername });
      if (usernameExists) {
        throw new Error('Username already taken');
      }
      user.username = newUsername;
    }
  
    if (newEmail) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        throw new Error('Email already in use');
      }
      user.email = newEmail;
    }
  
    // Save updated user
    await user.save();
  
    res.json({
      message: 'Profile updated successfully',
      username: user.username,
      email: user.email,
    });
  }),

  logout: asyncHandler(async (req, res) => {
    // Since JWT is stateless, the server does not need to do anything to invalidate the token
    // We just need to notify the client to remove the token.
    res.json({
      message: 'Logout successful. Please remove the token from client-side storage.'
    });
  })

}
  

module.exports = userController;