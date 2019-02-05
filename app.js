const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const db = require("./models/index");

app.use(bodyParser.json());
app.use(cors());

app.use(require('./routes'));


db.sequelize.sync()
    .then(() => {
        console.log('Tables created');
        app.listen(port, () => {
            console.log(`Started on port: ${port}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });




