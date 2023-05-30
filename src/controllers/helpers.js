exports.createItem = async (req, res, Model) => {
  try {
    let item = await Model.create(req.body);
    if (item.password) {
      item = {
        id: item.id,
        name: item.name,
        email: item.email,
      };
    }
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.errors[0].message });
  }
};

exports.findAll = async (__, res, Model) => {
  try {
    const items = await Model.findAll();
    if (items[0].password) {
      for (let n = 0; n < items.length; n += 1) {
        items[n] = {
          id: items[n].id,
          name: items[n].name,
          email: items[n].email,
        };
      }
    }
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.findById = async (req, res, Model) => {
  try {
    let item = await Model.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ error: `The item could not be found.` });
    } else if (item.password) {
      item = {
        id: item.id,
        name: item.name,
        email: item.email,
      };
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
    let item = await Model.findByPk(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'The item could not be found.' });
    } else if (item.password) {
      item = {
        id: item.id,
        name: item.name,
        email: item.email,
      };
    } else {
      item = {
        title: item.title,
        author: item.author,
        genre: item.genre,
        ISBN: item.ISBN,
      };
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
