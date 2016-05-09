

var express = require('express');
var controller = require('./applicant.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/bulkResumeDownload', controller.bulkResumeDownload);
router.get('/:id', controller.show);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);
router.get('/:id/getResume', controller.getResume);
router.get('/:id/downloadResume', controller.downloadResume);
router.post('/:id/changeState', controller.changeState);

module.exports = router;
