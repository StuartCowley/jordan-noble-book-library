const express = require('express');
const readerRouter = require('./routes/reader');

const app = express();

app.use(express.json());

app.get('/', (__, res) => {
  res.send('Hello World!');
});

app.use('/', readerRouter);

module.exports = app;
