const express = require('express');
const fs = require('fs').promises; // corrigindo para módulo fs, conforme o README

const serverTalker = express.Router();
const path = require('path');

const pathJoin = path.join(__dirname, '../talker.json');

async function getTalkersData() {
  const talkers = await fs.readFile(pathJoin, 'utf-8');
  return JSON.parse(talkers);
}

async function setTalker(talker) {
  await fs.writeFile(pathJoin, JSON.stringify(talker));
}

serverTalker.get('/', async (_req, res) => {
    const responseTalkers = await getTalkersData();
    if (!responseTalkers || responseTalkers.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(responseTalkers);
});

serverTalker.get('/:id', async (req, res) => {
  const responseTalkers = await getTalkersData();
  const { id } = req.params;
  // console.log('Requested ID:', id);
  const talkerById = responseTalkers.find((talker) => talker.id === Number(id));
  if (!talkerById) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(talkerById);
});

function validateToken(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16 || typeof authorization !== 'string') {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
}

function validateName(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
}

function validateAge(req, res, next) {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18 || !Number.isInteger(age)) {
    return res.status(400).json({ message:
       'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }
  next();
}

// const validateDateRegex = (data) => {
//   const regexData = /^(0?[1-9]|[1-2][0-9]|3[0-1])/(0?[1-9]|1[0-2])/\d{4}$/;
//   return regexData.test(data);
// };

function validateTalk(req, res, next) {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  const regexData = /^(0?[1-9]|[1-2][0-9]|3[0-1])\/(0?[1-9]|1[0-2])\/\d{4}$/;
  if (!talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!talk.watchedAt.match(regexData)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  if (talk.rate === 0) {
    return res.status(400).json({ message:
      'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  } 
  next();
}

function validateRate(req, res, next) {
  const { talk } = req.body;
  const { rate } = talk;
 if (!rate) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return res.status(400).json({ message:
       'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
}

serverTalker.post('/', validateToken, validateName, validateAge,
 validateTalk, validateRate,
 async (req, res) => {
  const responseTalkers = await getTalkersData();
  const newTalkerId = responseTalkers.length + 1;
  const talker = req.body;
  const newTalker = {
    id: newTalkerId,
    ...talker,
  };
  // responseTalkers.readFile(pathJoin, 'utf-8');
  responseTalkers.push(newTalker);
  await setTalker(responseTalkers);
  // const responseTalkersJSON = JSON.stringify(responseTalkers);
  // await fs.writeFile(pathJoin, responseTalkersJSON);
  return res.status(201).json(newTalker);
});

serverTalker.put('/:id', validateToken, validateName, validateAge,
  validateTalk, validateRate,
  async (req, res) => {
  const responseTalkers = await getTalkersData();
  const { id } = req.params;
  const talkerIndex = responseTalkers.findIndex((talker) => talker.id === Number(id));
  if (talkerIndex === -1) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  const talker = req.body;
  const newTalker = {
    id: Number(id),
    ...talker,
  };
  responseTalkers[talkerIndex] = newTalker;
  await setTalker(responseTalkers);
  return res.status(200).json(newTalker);
});

serverTalker.delete('/:id', validateToken, async (req, res) => {
  const responseTalkers = await getTalkersData();
  const { id } = req.params;
  const talkerIndex = responseTalkers.findIndex((talker) => talker.id === Number(id));
  if (talkerIndex === -1) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  responseTalkers.splice(talkerIndex, 1);
  await setTalker(responseTalkers);
  return res.status(204).json({ });
});

module.exports = serverTalker;