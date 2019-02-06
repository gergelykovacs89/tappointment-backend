var router = require('express').Router();

router.use('/api', require('./api/index'));
router.use('/user', require('./api/user'));

module.exports = router;
