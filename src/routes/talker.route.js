const express = require('express');
const fs = require('fs').promises; // corrigindo para módulo fs, conforme o README

const serverTalker = express.Router();
const path = require('path');

const pathJoin = path.join(__dirname, '..', 'talker.json');

function getTalkersData() {
  return fs.readFile(pathJoin, 'utf-8')
    .then((data) => JSON.parse(data))
    .catch((err) => {
      console.error(err);
    });
}

serverTalker.get('/', async (_req, res) => {
    const responseTalkers = await getTalkersData();
    if (!responseTalkers || responseTalkers.length === 0) {
      res.status(200).json([]);
    }
    res.status(200).json(responseTalkers);
});

serverTalker.get('/:id', async (req, res) => {
  const responseTalkers = await getTalkersData();
  const { id } = req.params;
  // console.log('Requested ID:', id);
  const talkerById = responseTalkers.find((talker) => talker.id === Number(id));
  if (!talkerById) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(talkerById);
});
module.exports = serverTalker;