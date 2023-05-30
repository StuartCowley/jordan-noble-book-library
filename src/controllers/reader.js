const { Reader } = require('../models');

exports.create = async (req, res) => {
  try {
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
  } catch (err) {
    res.status(400).json({ error: err.errors[0].message });
  }
};

exports.findAll = async (__, res) => {
  try {
    const readers = await Reader.findAll();
    res.status(200).json(readers);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findById = async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) {
      res.status(404).json({ error: 'The reader could not be found.' });
    }
    res.status(200).json(reader);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.updateEmail = async (req, res) => {
  const { email } = req.body;
  const updateData = {
    email: email,
  };
  try {
    const reader = await Reader.findByPk(req.params.id);
    const [updatedRow] = await Reader.update(updateData, {
      where: { id: req.params.id },
    });
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
