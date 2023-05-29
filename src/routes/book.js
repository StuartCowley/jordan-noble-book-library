const express = require('express');
const bookController = require('../controllers/book');

const router = express.Router();

router.post('/', bookController.create);

router.get('/', bookController.findAll);

router.get('/:id', bookController.findById);

router.put('/:id', bookController.replace);

module.exports = router;
