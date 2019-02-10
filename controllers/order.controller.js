const _ = require('lodash');
const db = require('../models/index');

exports.setOrderDetail = async function (req, res) {
    try {
        const body = _.pick(req.body, ['fullName', 'address', 'phoneNum', 'orderId']);
        await db.order.update({fullName: body.fullName, address: body.address, phoneNum: body.phoneNum}, {where: {id: body.orderId}});
        let order = await db.order.findByPk(body.orderId);
        let orderDetail = _.pick(order.dataValues, ['fullName', 'address', 'phoneNum']);
        res.send({
            message: 'Order details set.',
            status: 'OK',
            orderDetail: orderDetail
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.confirmOrder = async function (req, res) {
    try {
        let user = req.user;
        const body = _.pick(req.body, ['orderId']);
        await db.order.update({active: false}, {where: {id: body.orderId}});
        const order = await db.order.create({userId: user.id, active: true});
        res.send({
            message: 'Order sent.',
            status: 'OK',
            newOrder: order
        });
    } catch (err) {
        res.status(400).send(err);
    }
};
