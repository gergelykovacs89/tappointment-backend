module.exports = (sequelize, DataTypes) => {
    const MenuItem = sequelize.define('menuitem', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            allowNull: false
        },
        Category: {
            type: DataTypes.CHAR(120),
            allowNull: false
        },
        Description: {
            type: DataTypes.CHAR(255),
        },
        Name: {
            type: DataTypes.CHAR(120),
            allowNull: false
        },
        Price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Spicy: {
            type: DataTypes.SMALLINT
        },
        Vegatarian: {
            type: DataTypes.SMALLINT
        },
        createdAt: {
            type: DataTypes.DATE, defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE, defaultValue: DataTypes.NOW
        }
    });

    MenuItem.associate = (models) => {
        MenuItem.belongsToMany(models.order,
            {through: models.order_item, foreignKey: 'menuitemId',
                as: 'OrderItem', onDelete: 'RESTRICT', onUpdate: 'RESTRICT'})
    };

    MenuItem.getAllMenuItems = function () {
        return MenuItem.findAll({ raw: true });
    };

    return MenuItem;
};
