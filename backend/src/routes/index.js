const express = require('express');
const usersRoute = require('./usersRoute.js');
const cardsRoute = require('./cardsRoute.js');
const dreamsRoute = require('./dreamsRoute.js');
const emotionsRoute = require('./emotionsRoute.js');

const router = express.Router();

router.use('/users', usersRoute);
router.use('/cards', cardsRoute);
router.use('/dreams', dreamsRoute);
router.use('/emotions', emotionsRoute);

module.exports = router;

