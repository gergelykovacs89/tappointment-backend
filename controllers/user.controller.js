const _ = require('lodash');
const db = require('../models/index');

exports.registerUser = async function (req, res) {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        await db.user.registerUser(body);
        res.send({
            message: 'Registration was successful.',
            status: 'OK'
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.loginUser = async function (req, res) {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        let user = await db.user.findByCredentials(body);
        const userToken = user.generateAuthToken();
        const userDetails = await getUserDetails(user);
        res.status(200).send({
            status: 'OK',
            message: 'logged in',
            user: user,
            userToken: userToken,
            orderId: userDetails.orderId,
            orderDetail: userDetails.orderDetail
        });
    } catch (e) {
        res.status(400).send({
            status: 'WRONG_PASSWORD'
        });
    }
};

exports.getUser = async function (req, res) {
    try {
        let user = req.user;
        let token = req.token;
        const userDetails = await getUserDetails(user);
        res.status(200).send({
            status: 'OK',
            message: 'logged in',
            user: user,
            userToken: token,
            orderId: userDetails.orderId,
            orderDetail: userDetails.orderDetail
        });
    } catch (e) {
        res.status(400).send({
            status: 'Token expired'
        });
    }
};

getUserDetails = async function (user) {
    const order = await db.order.getCurrentOrder(user);
    const orderId = order[0].dataValues.id;
    let orderDetail = await db.order_item.getAllItems(orderId);
    orderDetail = orderDetail.map(orderItem =>_.pick(orderItem, ['menuitemId', 'numberOf']));
    user = _.pick(user.dataValues, ['email', 'id']);
    return {user, orderDetail, orderId};
};

