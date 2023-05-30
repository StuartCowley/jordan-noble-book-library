const { Book } = require('../models/index');

exports.create = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.errors[0].message });
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
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      res.status(404).json({ error: 'The book could not be found.' });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.replace = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
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

exports.update = async (req, res) => {
  const { title, author, genre, ISBN } = req.body;

  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      res.status(404).json({ error: 'The book could not be found.' });
    } else if (title) {
      const updatedBook = await book.update({
        title: title,
      });
      res.status(200).json(updatedBook);
    } else if (author) {
      const updatedBook = await book.update({
        author: author,
      });
      res.status(200).json(updatedBook);
    } else if (genre) {
      const updatedBook = await book.update({
        genre: genre,
      });
      res.status(200).json(updatedBook);
    } else if (ISBN) {
      const updatedBook = await book.update({
        ISBN: ISBN,
      });
      res.status(200).json(updatedBook);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Book.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      res.status(404).json({ error: 'The book could not be found.' });
    }
    res.status(204).json(deleted);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
