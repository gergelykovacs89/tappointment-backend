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

    User.associate = (models) => {
        User.hasMany(models.order);
    };

    User.findByCredentials = function (body) {
        return User.findOne({where: {email: body.email}})
            .then((user) => {
                if (!user) {
                    return Promise.reject();
                }
                return new Promise((resolve, reject) => {
                    bcrypt.compare(body.password, user.password, (err, res) => {
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
            email: user.email,
            access: access
        }, process.env.JWT_SECRET).toString();
    };

    User.findByToken = function (token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return Promise.reject();
        }
        return User.findOne({where: {
            id: decoded.id,
            email: decoded.email
        }});
    };

    User.registerUser = function (body) {
        return User.create({email: body.email, password: body.password});
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


