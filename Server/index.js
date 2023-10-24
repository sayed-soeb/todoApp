const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());

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
});

//Update Todo
app.put('/api/updatetodo/:id', (req,res) => {
    Todo.findByIdAndUpdate(req.params.id, {text: req.body.text })
    .then(() => res.json({ message: 'Todo updated successfully'}))
    .catch(err => console.log(err));
});

//Get All Todos
app.get('/api/gettodos', (req,res) => {
    Todo.find()
    .then(todos => res.json(todos))
    .catch(err => console.log(err));
});

//Delete Todo
app.delete('/api/deletetodo/:id', (req,res) => {
    Todo.findByIdAndRemove(req.params.id)
    .then(() => res.json({ message: 'Todo deleted successfully'}))
    .catch(err => console.log(err));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})