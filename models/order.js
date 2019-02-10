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
            {through: models.menuitem_order, foreignKey: 'orderId',
                as: 'Order', onDelete: 'RESTRICT', onUpdate: 'RESTRICT'})
    };

    return Order;

};


