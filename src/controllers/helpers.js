const { Book, Genre, Author, Reader } = require('../models/index');

exports.createItem = async (req, res, Model) => {
  try {
    const item = await Model.create(req.body);
    delete item.dataValues.password;

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.errors[0].message });
  }
};

exports.findAll = async (__, res, Model) => {
  let items;
  let params;
  if (Model === Book) params = { include: [Reader, Genre, Author] };
  else if (Model === Genre || Model === Author || Model === Reader) 
  params = { include: Book };

  try {
    items = await Model.findAll(params);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findById = async (req, res, Model) => {
  let item;
  let params;
  if (Model === Book) params = { include: [Reader, Genre, Author] };
  else if (Model === Genre || Model === Author || Model === Reader) 
  params = { include: Book };

  try {
    item = await Model.findByPk(req.params.id, params);
    if (!item) {
      res.status(404).json({ error: `The item could not be found.` });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.update = async (req, res, Model, updateData) => {
  try {
    await Model.update(updateData, {
      where: { id: req.params.id },
    });
    const item = await Model.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'The item could not be found.' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.delete = async (req, res, Model) => {
  const deleted = await Model.destroy({ where: { id: req.params.id } });
  try {
    if (!deleted) {
      res.status(404).json({ error: 'The item could not be found.' });
    }
    res.status(204).json(deleted);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
