const { Book } = require('../models/index');
const helper = require('./helpers');

exports.create = async (req, res) => {
  helper.createItem(req, res, Book);
};

exports.findAll = async (__, res) => {
  helper.findAll(__, res, Book);
};

exports.findById = async (req, res) => {
  helper.findById(req, res, Book);
};

exports.update = async (req, res) => {
  const updateData = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    ISBN: req.body.ISBN,
  };
  helper.update(req, res, Book, updateData);
};

exports.delete = async (req, res) => {
  helper.delete(req, res, Book);
};
