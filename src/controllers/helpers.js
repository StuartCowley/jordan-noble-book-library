const { Reader, Book } = require('../models/index');

function createItem(req, res) {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.errors[0].message });
  }
}

module.exports = { createItem };
