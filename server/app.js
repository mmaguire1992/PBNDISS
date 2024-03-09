const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const userRouter = require('./routes/userRouter'); 
const imageRouter = require('./routes/imageRouter');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cors());


app.use('/api', imageRouter);


app.use('/api/users', userRouter);

module.exports = app;
