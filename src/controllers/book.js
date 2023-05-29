const { Book } = require('../models/index');

exports.create = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findAll = async (__, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findById = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.status(200).json(book);
};
