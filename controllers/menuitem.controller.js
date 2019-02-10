const db = require('../models/index');

exports.getMenuItems = async function (req, res) {
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
};
