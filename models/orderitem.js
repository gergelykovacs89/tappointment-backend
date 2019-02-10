const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {

    const OrderItem = sequelize.define('order_item', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            allowNull: false
        },

        numberOf: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    OrderItem.getAllItems = function (orderId) {
      return OrderItem.findAll({where: {orderId: orderId}, raw: true});
    };

    OrderItem.addToOrder = async function (body) {
        const orderItem = await OrderItem.findOrCreate({
            where:
                {
                    orderId: body.orderId,
                    menuitemId: body.menuitemId
                },
            defaults: {numberOf: 1}});
        return orderItem;
    };

    OrderItem.incrementItem = async function (body, cartItem) {
        await OrderItem.increment('numberOf', {
            where: {
                orderId: body.orderId,
                menuitemId: body.menuitemId
            }});
        cartItem = await OrderItem.findByPk(cartItem[0].dataValues.id);
        return _.pick(cartItem.dataValues, ['menuitemId', 'numberOf']);
    };

    OrderItem.decrementItem = async function (body) {
        await OrderItem.decrement('numberOf', {
            where: {
                orderId: body.orderId,
                menuitemId: body.menuitemId
            }});
        const updatedItem = await OrderItem.find({where: {orderId: body.orderId, menuitemId: body.menuitemId}});
        return _.pick(updatedItem.dataValues, ['menuitemId', 'numberOf']);
    };

    return OrderItem;
};
