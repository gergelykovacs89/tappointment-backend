const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    User.findByCredentials = function (email, password) {
        return User.findOne({where: {email: email}})
            .then((user) => {
                if (!user) {
                    return Promise.reject();
                }
                return new Promise((resolve, reject) => {
                    bcrypt.compare(password, user.password, (err, res) => {
                        if (!res) {
                            reject();
                        } else {
                            resolve(user);
                        }
                    });
                });
            });
    };

    User.prototype.generateAuthToken = function () {
        let user = this;
        const access = 'auth';
        return jwt.sign({
            id: user.id,
            access: access
        }, process.env.JWT_SECRET).toString();
    };

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


