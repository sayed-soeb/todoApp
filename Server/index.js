const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

require('dotenv').config();

//Connecting to mongodb
mongoose.connect(process.env.DbUrl,{
    useUnifiedTopology:true,
    useNewUrlParser:true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Error connecting to DB'));
db.once('open',function(){
    console.log('Connected to Database');
});

