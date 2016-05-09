

var express = require('express');
var controller = require('./reference.controller');

var router = express.Router();

router.get('/:jobId/references', controller.index);
router.get('/:jobId/references/:id/getResume', controller.getResume);
// router.get('/:jobId/references/:id', controller.show);
router.post('/:jobId/references', controller.create);
router.post('/:jobId/references/:id/accept', controller.accept);
// router.put('/:jobId/references/:id', controller.update);
// router.patch('/:jobId/references/:id', controller.update);
// router.delete('/:jobId/references/:id', controller.destroy);

module.exports = router;
