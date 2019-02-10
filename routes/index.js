let router = require('express').Router();

router.use('/api', require('./api/index'));
router.use('/user', require('./api/user'));
router.use('/cart', require('./api/menuitemorder'));
router.use('/order', require('./api/order'));

module.exports = router;
