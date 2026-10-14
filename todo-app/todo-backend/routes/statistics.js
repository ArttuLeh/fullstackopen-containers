const express = require('express');
const redis = require('../redis');
const router = express.Router();

/* GET statistics */
router.get('/', async (req, res) => {
  try {
    const addedTodos = await redis.get('added_todos');
    res.json({ added_todos: Number(addedTodos) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
