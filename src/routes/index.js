const router = require('express').Router();
const serverTalker = require('./talker.route');

router.use('/talker', serverTalker);

module.exports = router;