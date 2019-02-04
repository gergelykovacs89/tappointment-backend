const router = require('express').Router();

router.get('/', (req, res) => {
    res.send({
        message: 'app is up and running'
    });
});


module.exports = router;
