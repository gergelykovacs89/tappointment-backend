const _ = require('lodash');
const db = require('../models/index');

exports.addToOrder = async function (req, res) {
    try {
        const body = _.pick(req.body, ['menuitemId', 'amount', 'orderId']);
        await checkOrder(body, res);
        let cartItem = await db.order_item.addToOrder(body);
        if (!cartItem[0]._options.isNewRecord) {
            cartItem = await db.order_item.incrementItem(body, cartItem);
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
        const updatedItem = await db.order_item.decrementItem(body);
        if (updatedItem.numberOf > 0) {
            res.send({
                status: 'REMOVED',
                cartItem: updatedItem
            });
        } else {
            const isDeleted = await db.order_item.destroy({where: {orderId: body.orderId, menuitemId: body.menuitemId}});
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
        const isDeleted = await db.order_item.destroy({where: {orderId: deletedItem.orderId, menuitemId: deletedItem.menuitemId}});
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

checkOrder = async function (body, res) {
    const MENU = await db.menuitem.findAll();
    const menuItems = await db.order_item.getAllItems(body.orderId);
    const orderStats = getOrderStats(MENU, menuItems);
    let currentItemPrice = MENU.find(item => item.dataValues.id === body.menuitemId).dataValues.Price;
    let isNewItem = menuItems.findIndex(menuItem => menuItem.menuitemId === body.menuitemId) === -1;
    if (orderStats.orderSum + currentItemPrice > 10000 && orderStats.orderItemsNum + (isNewItem ? 1 : 0) > 1) {
        throw new Error('10000 bug activated');
    }

    if (orderStats.orderSum + currentItemPrice >= +process.env.ORDER_UPPER_BOUND) {
        return res.status(400).send({ error: `A rendelés felső határa: ${+process.env.ORDER_UPPER_BOUND} Ft`});
    }
};

getOrderStats = function (MENU, menuItems) {
    let orderSum = 0;
    let orderItemsNum = 0;
    menuItems.forEach((menuItem) => {
        let itemPrice = MENU.find(item => item.dataValues.id === menuItem.menuitemId).dataValues.Price;
        orderSum += menuItem.numberOf * itemPrice;
        orderItemsNum++;
    });
    return {orderSum, orderItemsNum};
};
