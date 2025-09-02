const express = require("express");
const User = require("../model/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require("dotenv").config()

router.post(
  "/createuser",
  body("email", "Invalid email").isEmail(),
  body("password", "Invalid password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //used to encrypt the password
    const salt=await bcrypt.genSalt(10);
    const secpassword=await bcrypt.hash(req.body.password,salt);
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpassword ,
        location: req.body.location,
      });
      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
      });
    }
  }
);

router.post(
  "/loginuser",
  body("email", "Invalid email").isEmail(),
  body("name").optional().isLength({ min: 6 }),
  body("password", "Invalid password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email.toLowerCase();
    try {
      let userData = await User.findOne({email});
      if (!userData) {
        return res
          .status(400)
          .json({ error: "try to login with correct email" });
      }
      const pwdcompare=await bcrypt.compare(req.body.password,userData.password)
      if (!pwdcompare ) {
        return res
          .status(400)
          .json({ error: "try to login with correct password" });
      }
      //jwt authentication
      const data={
        user:{
          id:userData.id
        }
      }
      const authToken=jwt.sign(data,process.env.SECRETKEY)
      return res.json({ success: true,authToken:authToken});
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
      });
    }
  }
);

module.exports = router;



