const express = require("express");
const router = express.Router();
const { registerUser, loginUser , getMe} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");


router.post("/register", registerUser);
router.post("/login", loginUser); 
router.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
  });
router.get("/me", authMiddleware, getMe); 

  
module.exports = router;




