const express = require('express');
const bookController = require('../controllers/book');

const router = express.Router();

router.post('/', bookController.create);

router.get('/', bookController.findAll);

router.get('/:id', bookController.findById);

module.exports = router;
