const express = require('express');

const routers = express.Router();
const serverTalker = require('./talker.route');

routers.use('/talker', serverTalker);

module.exports = routers;