const express = require('express');
const indexRoutes = express.Router();

indexRoutes.use('/admin', require('../routes/admin.routes'));
indexRoutes.use('/user', require('../routes/user.routes'));

module.exports = indexRoutes;      