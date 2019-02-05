const router = require('express').Router();
const _ = require('lodash');
const db = require('../../models/index');

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


module.exports = router;
