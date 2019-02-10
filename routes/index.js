var router = require('express').Router();

router.use('/api', require('./api/index'));
router.use('/user', require('./api/user'));
router.use('/cart', require('./api/menuitemorder'));

module.exports = router;
