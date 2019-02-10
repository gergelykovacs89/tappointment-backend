const router = require('express').Router();
const _ = require('lodash');
const db = require('../../models/index');
const {authenticate} = require('../../middleware/authenticate');

router.post('/register', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        await db.user.create({email: body.email, password: body.password});
        res.send({
            message: 'Registration was successful.',
            status: 'OK'
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        let user = await db.user.findByCredentials(body.email, body.password);
        const userToken = user.generateAuthToken();
        const order = await db.order.findOrCreate({where: {userId: user.id, active: true}, defaults: {userId: user.id}});
        const orderId = order[0].dataValues.id;
        let orderDetail = await db.menuitem_order.findAll({where: {orderId: orderId}, raw: true});
        orderDetail = orderDetail.map(orderItem =>_.pick(orderItem, ['menuitemId', 'numberOf']));
        user = _.pick(user.dataValues, ['email', 'id']);
        res.status(200).send({
            status: 'OK',
            message: 'logged in',
            user: user,
            userToken: userToken,
            orderId: orderId,
            orderDetail: orderDetail
        });
    } catch (e) {
        console.log(e);
        res.status(400).send({
            status: 'WRONG_PASSWORD'
        });
    }
});


router.get('/get-user', authenticate, async (req, res) => {
    try {
        let user = req.user;
        let token = req.token;
        const lastActiveOrder = await db.order.find({where: {userId: user.id, active: true}});
        let orderDetail = await db.menuitem_order.findAll({where: {orderId: lastActiveOrder.dataValues.id}, raw: true});
        orderDetail = orderDetail.map(orderItem =>_.pick(orderItem, ['menuitemId', 'numberOf']));
        user = _.pick(user.dataValues, ['email', 'id']);
        res.status(200).send({
            status: 'OK',
            message: 'logged in',
            user: user,
            userToken: token,
            orderId: lastActiveOrder.dataValues.id,
            orderDetail: orderDetail
        });
    } catch (e) {
        res.status(400).send({
            status: 'Token expired'
        });
    }
});

module.exports = router;
