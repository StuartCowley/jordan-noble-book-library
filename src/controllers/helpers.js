exports.createItem = async (req, res, Model) => {
  try {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.errors[0].message });
  }
};

exports.findAll = async (__, res, Model) => {
  try {
    const items = await Model.findAll();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findById = async (req, res, Model) => {
  try {
    const reader = await Model.findByPk(req.params.id);
    if (!reader) {
      res.status(404).json({ error: `The item could not be found.` });
    }
    res.status(200).json(reader);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.update = async (req, res, Model, updateData) => {
  try {
    await Model.update(updateData, {
      where: { id: req.params.id },
    });
    const book = await Model.findByPk(req.params.id);
    if (!book) {
      res.status(404).json({ error: 'The item could not be found.' });
    }
    res.status(200).json(book);
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
