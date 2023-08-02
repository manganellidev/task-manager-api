const express = require('express');
const helmet = require('helmet');
require('./db/mongoose');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();

app.use(helmet());
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

module.exports = app;
