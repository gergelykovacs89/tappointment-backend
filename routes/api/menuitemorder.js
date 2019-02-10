const router = require('express').Router();
const {authenticate} = require('../../middleware/authenticate');
const OrderItemController = require('../../controllers/orderitem.controller');

router.put('/add-to-order', authenticate, (req, res) => {
    OrderItemController.addToOrder(req, res);
});

router.put('/remove-from-order', authenticate, (req, res) => {
    OrderItemController.removeFromOrder(req, res);
});

router.put('/delete-from-order', authenticate, (req, res) => {
    OrderItemController.deleteFromOrder(req, res);
});

module.exports = router;
