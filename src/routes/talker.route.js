const express = require('express');
const fs = require('fs').promises; // corrigindo para módulo fs, conforme o README

const serverTalker = express.Router();
const path = require('path');

const pathTalker = path.join(__dirname, '..', 'talker.json');

serverTalker.get('/', async (_req, res) => {
    const data = await fs.readFile(pathTalker, 'utf-8');
    const talkers = JSON.parse(data);
    //
    if (!talkers || talkers.length === 0) {
      res.status(200).json([]);
    }
    res.status(200).json(talkers);
});

module.exports = serverTalker;