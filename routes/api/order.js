const router = require('express').Router();
const {authenticate} = require('../../middleware/authenticate');
const OrderController = require('../../controllers/order.controller');

router.post('/set-order-details', authenticate, (req, res) => {
    OrderController.setOrderDetail(req, res);
});

router.post('/confirm-order', authenticate, (req, res) => {
    OrderController.confirmOrder(req, res);
});

module.exports = router;
