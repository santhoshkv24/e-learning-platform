const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "instructor", "admin"], default: "student" }
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  console.log("Before hashing:", this.password); 
  this.password = await bcrypt.hash(this.password, 10);
  console.log("After hashing:", this.password);  
  next();
});

module.exports = mongoose.model("User", UserSchema);
