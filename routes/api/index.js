const router = require('express').Router();
const MenuItemController = require('../../controllers/menuitem.controller');

router.get('/get-menu-items', (req, res) => {
    MenuItemController.getMenuItems(req, res);
});

module.exports = router;
