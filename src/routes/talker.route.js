const express = require('express');
const fs = require('fs').promises; // corrigindo para módulo fs, conforme o README

const serverTalker = express.Router();
const path = require('path');

const pathJoin = path.join(__dirname, '../talker.json');

async function getTalkersData() {
  const talkers = await fs.readFile(pathJoin, 'utf-8');
  return JSON.parse(talkers);
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

function validateToken(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
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

function validateTalk(req, res, next) {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  const { watchedAt, rate } = talk;
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!watchedAt.match(/\d{2}\/\d{2}\/\d{4}/)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  if (rate === 0) {
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

serverTalker.post('/', 
validateToken,
 validateName, validateAge, validateTalk, validateRate,
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
  // const responseTalkersJSON = JSON.stringify(responseTalkers);
  // await fs.writeFile(pathJoin, responseTalkersJSON);
  res.status(201).json(responseTalkers);
});

module.exports = serverTalker;