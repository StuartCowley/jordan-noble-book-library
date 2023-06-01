const { Genre } = require('../models/index');
const helper = require('./helpers');

exports.create = async (req, res) => {
  helper.createItem(req, res, Genre);
};

exports.findAll = async (__, res) => {
  helper.findAll(__, res, Genre);
};

exports.findById = async (req, res) => {
  helper.findById(req, res, Genre);
};

exports.update = async (req, res) => {
  const updateData = {
    author: req.body.author,
  };
  helper.update(req, res, Genre, updateData);
};

exports.delete = async (req, res) => {
  helper.delete(req, res, Genre);
};
