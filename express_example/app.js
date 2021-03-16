require('dotenv').config();
require('./db-connection');
const express = require('express');
const app = express();
const users = require('./users/users.controller');
const { writeInFile, readFromFile } = require('./commons/util');
const { handleError } = require('./commons/middlewares/error-handler.middleware');
const asyncHandler = require('express-async-handler');

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/users', users);

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.post('/createfile', asyncHandler(async (req, res) => {
    await writeInFile(req.body.content);
    res.send("File created successfully.");
}))

app.get('/readfile', asyncHandler(async (req, res) => {
    const data = await readFromFile();
    res.send(data);
}))

app.use(handleError);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening to port ${port}. 🚀`);
})