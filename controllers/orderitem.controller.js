const _ = require('lodash');
const db = require('../models/index');

exports.addToOrder = async function (req, res) {
    try {
        const body = _.pick(req.body, ['menuitemId', 'amount', 'orderId']);
        let orderSum = 0;
        const MENU = await db.menuitem.findAll();
        const menuItems = await db.menuitem_order.findAll({where: {orderId: body.orderId}});
        menuItems.forEach((menuItem) => {
            let itemPrice = MENU.find(item => item.dataValues.id === menuItem.menuitemId).dataValues.Price;
            orderSum += menuItem.numberOf * itemPrice;
        });
        let currentItemPrice = MENU.find(item => item.dataValues.id === body.menuitemId).dataValues.Price;
        if (orderSum + currentItemPrice === 10000) {
            throw new Error('10000 bug activated');
        }
        if (orderSum + currentItemPrice >= +process.env.ORDER_UPPER_BOUND) {
            return res.status(400).send({ error: `A rendelés felső határa: ${+process.env.ORDER_UPPER_BOUND} Ft`});
        }
        let cartItem = await db.menuitem_order.findOrCreate({
            where:
                {
                    orderId: body.orderId,
                    menuitemId: body.menuitemId
                },
            defaults: {numberOf: 1}});
        const isNewRecord = cartItem[0]._options.isNewRecord;
        if (!isNewRecord) {
            await db.menuitem_order.increment('numberOf', {
                where: {
                    orderId: body.orderId,
                    menuitemId: body.menuitemId
                }});
            cartItem = await db.menuitem_order.findByPk(cartItem[0].dataValues.id);
            cartItem = _.pick(cartItem.dataValues, ['menuitemId', 'numberOf']);
        } else {
            cartItem = _.pick(cartItem[0].dataValues, ['menuitemId', 'numberOf']);
        }
        res.send({
            status: 'ADDED',
            cartItem: cartItem
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.removeFromOrder = async function (req, res) {
    try {
        const body = _.pick(req.body, ['menuitemId', 'orderId']);
        await db.menuitem_order.decrement('numberOf', {where: {orderId: body.orderId, menuitemId: body.menuitemId}});
        const updatedItem = await db.menuitem_order.find({where: {orderId: body.orderId, menuitemId: body.menuitemId}});
        if (updatedItem.numberOf > 0) {
            res.send({
                status: 'REMOVED',
                cartItem: updatedItem
            });
        } else {
            const isDeleted = await db.menuitem_order.destroy({where: {orderId: body.orderId, menuitemId: body.menuitemId}});
            if (isDeleted) {
                res.send({
                    status: 'DELETED',
                    cartItem: updatedItem
                });
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteFromOrder = async function (req, res) {
    try {
        const deletedItem = _.pick(req.body, ['menuitemId', 'orderId']);
        const isDeleted = await db.menuitem_order.destroy({where: {orderId: deletedItem.orderId, menuitemId: deletedItem.menuitemId}});
        if (isDeleted) {
            res.send({
                status: 'DELETED',
                cartItem: deletedItem
            });
        }
    } catch (err) {
        res.status(400).send(err);
    }
};
