const { Reader } = require('../models');
const helper = require('./helpers');

exports.create = async (req, res) => {
  helper.createItem(req, res, Reader);
};

exports.findAll = async (__, res) => {
  helper.findAll(__, res, Reader);
};

exports.findById = async (req, res) => {
  helper.findById(req, res, Reader);
};

exports.update = async (req, res) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email,
  };
  helper.update(req, res, Reader, updateData);
};

exports.delete = async (req, res) => {
  helper.delete(req, res, Reader);
};
