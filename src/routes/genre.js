const express = require('express');
const genreController = require('../controllers/genre');

const router = express.Router();

router.post('/', genreController.create);

router.get('/', genreController.findAll);

router.get('/:id', genreController.findById);

router.patch('/:id', genreController.update);

router.delete('/:id', genreController.delete);

module.exports = router;
