const express = require('express');

const serverTalker = express.Router();

const talkers = require('../talker.json');

serverTalker.get('/', (_req, res) => {
  res.status(200).json(talkers);
});

module.exports = serverTalker;
