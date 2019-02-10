module.exports = (sequelize, DataTypes) => {

    const MenuItemOrder = sequelize.define('menuitem_order', {
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

    return MenuItemOrder;
};
