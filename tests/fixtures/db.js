/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Gilberto Bibibi',
    email: 'gilberobibibi@manga.dev',
    password: 'gilbertobibibi!@#dev',
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
        }
    ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Greta Julius',
    email: 'gretajulius@manga.dev',
    password: 'gretajulius!@#dev',
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
        }
    ]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOneId
};

const taskTwo = {
    description: 'Second task',
    completed: true,
    owner: userOneId
};

const taskThree = {
    description: 'Third task',
    completed: true,
    owner: userTwoId
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    for (const newUser of [userOne, userTwo]) {
        new User(newUser).save();
    }
    for (const newTask of [taskOne, taskTwo, taskThree]) {
        new Task(newTask).save();
    }
};

const teardownDatabase = async () => {
    await User.deleteMany();
    mongoose.connection.close();
};

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
    teardownDatabase
};
