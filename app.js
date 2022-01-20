const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');
require('dotenv/config');

app.use(bodyParser.json());

//Importing Routes 
const postsRoute = require('./routes/posts')

//It could be a middlewere
app.use(cors());
app.use('/posts',postsRoute);


//app.use('/user',userRoute);

app.get('/',(req,res)=>{
    res.send('we are on home');  
});

app.get('/posts',(req,res)=>{
    res.send('we are in post')
});

//DB Connection
mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true}, ()=>
    console.log('connected db')
);

app.listen(3000);