const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Dreams route is working.');
})

module.exports = router;