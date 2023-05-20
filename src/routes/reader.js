const express = require('express');
const {
  createReader,
  findAllReaders,
  findReaderById,
  updateEmail,
  deleteReader,
} = require('../controllers/reader');

const router = express.Router();

router.route('/readers').post(createReader);

router.route('/readers').get(findAllReaders);

router.route('/readers/:id').get(findReaderById);

router.route('/readers/:id').patch(updateEmail);

router.route('/readers/:id').delete(deleteReader);

module.exports = router;
