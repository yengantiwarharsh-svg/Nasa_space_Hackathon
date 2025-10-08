import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: String, 
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  history: [historySchema],  // embedded array of history objects
});

// Export the User model
const User = mongoose.model("User", userSchema);
export default User;
