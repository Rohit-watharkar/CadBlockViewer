const express = require('express');
const router = express.Router();
const controller = require('../controllers/blockController');

router.post('/upload', controller.uploadFile);
router.get('/blocks', controller.getBlocks);
router.get('/blocks/:id', controller.getBlockDetails);
router.get('/search', controller.searchBlocks);

module.exports = router;