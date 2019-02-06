const router = require('express').Router();
const db = require('../../models/index');


router.get('/get-menu-items', async (req, res) => {
    try {
        const menuitems = await db.menuitem.getAllMenuItems();
        res.status(200).send({
            menuitems: menuitems
        });
    } catch (e) {
        res.status(400).send({
            status: 'Something went wrong'
        });
    }
});

module.exports = router;
