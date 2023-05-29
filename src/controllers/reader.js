const { Reader } = require('../models');

exports.create = async (req, res) => {
  const newReader = await Reader.create(req.body);
  try {
    res.status(201).json(newReader);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findAll = async (__, res) => {
  const readers = await Reader.findAll();
  try {
    res.status(200).json(readers);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findById = async (req, res) => {
  const reader = await Reader.findByPk(req.params.id);
  try {
    if (!reader) {
      res.status(404).json({ error: 'The reader could not be found.' });
    }
    res.status(200).json(reader);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.updateEmail = async (req, res) => {
  const reader = await Reader.findByPk(req.params.id);
  const { email } = req.body;
  const updateData = {
    email: email,
  };
  const [updatedRow] = await Reader.update(updateData, {
    where: { id: req.params.id },
  });
  try {
    if (!reader) {
      res.status(404).json({ error: 'The reader could not be found.' });
    }
    res.status(200).json(updatedRow);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.delete = async (req, res) => {
  const deleted = await Reader.destroy({ where: { id: req.params.id } });
  try {
    if (!deleted) {
      res.status(404).json({ error: 'The reader could not be found.' });
    }
    res.status(204).json(deleted);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
