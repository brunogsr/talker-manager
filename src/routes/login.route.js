const express = require('express');
const crypto = require('crypto');

const serverLogin = express.Router();

function validateEmail(req, res, next) {
 const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!email.match(/\S+@\S+\.\S+/)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
}
function validatePassword(req, res, next) {
  const { password } = req.body;
   if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
   }
   if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
   }
   next();
 }

serverLogin.post('/', validateEmail, validatePassword, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});
module.exports = serverLogin;