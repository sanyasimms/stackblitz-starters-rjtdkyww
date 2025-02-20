const express = require('express');
const { resolve } = require('path');
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./schema.js");
const { connect } = require('http2');

const app = express();
const port = 3010;
const MONGO_URI=process.env.MONGO_URI;

app.use(express.json());

const connectDB = async ()=>{
  try{
    await mongoose.connect(MONGO_URI)
     
      console.log("connected to database");
  } catch (error){
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};
connectDB();

app.post("/api/users", async(req,res)=>{
  try{
    const {name, email, password}= req.body;
    if(!name || !email || !password){
      return res.status(400).json({message: "All fields (name, email, password) are required"});
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "Email alredy exists"})
    }
    const newUser = new User({name, email, password});
    await newUser.save();

    res.status(201).json({message: "User created successfully"});
  }catch(error){
    res.status(500).json({message: "server error", error: error.message})
  }
})

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});