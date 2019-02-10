const router = require('express').Router();
const {authenticate} = require('../../middleware/authenticate');
const UserController = require('../../controllers/user.controller');

router.post('/register', (req, res) => {
    UserController.registerUser(req, res);
});

router.post('/login', (req, res) => {
    UserController.loginUser(req, res);
});

router.get('/get-user', authenticate, (req, res) => {
    UserController.getUser(req, res);
});

module.exports = router;
