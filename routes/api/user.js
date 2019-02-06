const router = require('express').Router();
const _ = require('lodash');
const db = require('../../models/index');
const {authenticate} = require('../../middleware/authenticate');

router.post('/register', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password', 'fullName']);
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
        user = _.pick(user.dataValues, ['email', 'id']);
        res.header('x-auth', userToken).status(200).send({
            status: 'OK',
            message: 'logged in',
            user: user,
            userToken: userToken
        });
    } catch (e) {
        res.status(400).send({
            status: 'WRONG_PASSWORD'
        });
    }
});


router.get('/get-user', authenticate, async (req, res) => {
    try {
        let user = req.user;
        let token = req.token;
        user = _.pick(user.dataValues, ['email', 'id']);
        res.status(200).send({
            status: 'OK',
            message: 'logged in',
            user: user,
            userToken: token
        });
    } catch (e) {
        res.status(400).send({
            status: 'Token expired'
        });
    }
});

module.exports = router;
