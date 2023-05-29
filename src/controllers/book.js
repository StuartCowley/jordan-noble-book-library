const { Book } = require('../models/index');

exports.create = async (req, res) => {
  const book = await Book.create(req.body);
  try {
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findAll = async (__, res) => {
  const books = await Book.findAll();
  try {
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findById = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  try {
    if (!book) {
      res.status(404).json({ error: 'The book could not be found.' });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.replace = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  try {
    if (!book) {
      res.status(404).json({ error: 'The book could not be found.' });
    }
    const updatedBook = await book.update({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      ISBN: req.body.ISBN,
    });
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
