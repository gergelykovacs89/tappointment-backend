const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        }
    });

    User.associate = (models) => {
        User.hasMany(models.order);
    };

    User.beforeCreate((user, options) => {
        return new Promise(((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    user.password = hash;
                    return resolve(user, options);
                })
            });
        }));
    });

    return User;

};


