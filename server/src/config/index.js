// config/index.js
const vars = require('./vars');
const db = require('./db');

module.exports = {
    vars,
    dbConnect: db.connect,
    sequelize: db.sequelize, // Export sequelize instance
};