module.exports = (sequelize, DataTypes) => {

    const Order = sequelize.define('order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        fullName: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        phoneNum: {
            type: DataTypes.STRING
        }
    });

    Order.associate = (models) => {
        Order.belongsTo(models.user);
        Order.belongsToMany(models.menuitem,
            {through: models.order_item, foreignKey: 'orderId',
                as: 'Order', onDelete: 'RESTRICT', onUpdate: 'RESTRICT'})
    };

    Order.setDetails = function (body) {
        return Order.update({fullName: body.fullName, address: body.address, phoneNum: body.phoneNum}, {where: {id: body.orderId}});
    };

    Order.finalizeOrder = function (body) {
        return Order.update({active: false}, {where: {id: body.orderId}});
    };

    Order.createOrder = function (user) {
        return Order.create({userId: user.id, active: true});
    };

    Order.getCurrentOrder = function (user) {
        return Order.findOrCreate({where: {userId: user.id, active: true}, defaults: {userId: user.id}});
    };

    return Order;

};


