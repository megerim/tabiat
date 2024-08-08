const express = require('express');
const router = express.Router();
const duyuruController = require('../controllers/duyuruController');

router.post('/', duyuruController.createDuyuru);
router.delete('/:id', duyuruController.deleteDuyuru);

module.exports = router;
