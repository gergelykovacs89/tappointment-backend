'use strict';

const fs = require('fs');
const db = require("../models/index");

module.exports = {
  up: (queryInterface, Sequelize) => {
    let sql = fs.readFileSync('./SampleData - JS.sql').toString();
    return db.sequelize.query(sql);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('menuitems');
  }
};
