const express = require('express');

const routers = express.Router();
const serverTalker = require('./talker.route');
const serverLogin = require('./login.route');

routers.use('/talker', serverTalker);
routers.use('/login', serverLogin);

module.exports = routers;