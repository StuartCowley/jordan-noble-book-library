const express = require('express');
const readerRouter = require('./routes/reader');
const bookRouter = require('./routes/book');

const app = express();

app.use(express.json());

app.get('/', (__, res) => {
  res.send('Hello World!');
});

app.use('/readers', readerRouter);

app.use('/books', bookRouter);

module.exports = app;
