const { Author } = require('../models/index');
const helper = require('./helpers');

exports.create = async (req, res) => {
  helper.createItem(req, res, Author);
};

exports.findAll = async (__, res) => {
  helper.findAll(__, res, Author);
};

exports.findById = async (req, res) => {
  helper.findById(req, res, Author);
};

exports.update = async (req, res) => {
  const updateData = {
    author: req.body.author,
  };
  helper.update(req, res, Author, updateData);
};

exports.delete = async (req, res) => {
  helper.delete(req, res, Author);
};
