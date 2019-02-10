const _ = require('lodash');
const db = require('../models/index');

exports.setOrderDetail = async function (req, res) {
    try {
        const body = _.pick(req.body, ['fullName', 'address', 'phoneNum', 'orderId']);
        await db.order.setDetails(body);
        res.send({
            message: 'Order details set.',
            status: 'OK'
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.confirmOrder = async function (req, res) {
    try {
        let user = req.user;
        const body = _.pick(req.body, ['orderId']);
        await db.order.finalizeOrder(body);
        const order = await db.order.createOrder(user);
        res.send({
            message: 'Order sent.',
            status: 'OK',
            newOrder: order
        });
    } catch (err) {
        res.status(400).send(err);
    }
};
