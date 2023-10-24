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

//Models
const Todo = require('./models/Todo');

//Middleware
app.use(bodyParser.json());

//API Endpoints

//Add Todo
app.post('/api/addtodo',(req,res) => {
    const newTodo = new Todo({
        text: req.body.text,
        completed: false,
    });

    newTodo.save()
    .then(todo => res.json(todo))
    .catch(err => console.log(err));
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})