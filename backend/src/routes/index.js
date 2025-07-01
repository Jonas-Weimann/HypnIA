const express = require('express');
const usersRoute = require('./users');
const cardsRoute = require('./cards');
const dreamsRoute = require('./dreams');
const emotionsRoute = require('./emotions');

const router = express.Router();

router.use('/users', usersRoute);
router.use('/cards', cardsRoute);
router.use('/dreams', dreamsRoute);
router.use('/emotions', emotionsRoute);

module.exports = router;

