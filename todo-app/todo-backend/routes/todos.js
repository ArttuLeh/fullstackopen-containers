const express = require('express');
const redis = require('../redis');
const { Todo } = require('../mongo');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  const addedTodos = await redis.get('added_todos');
  const newAddedTodos = Number(addedTodos) + 1;
  await redis.set('added_todos', newAddedTodos);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res, next) => {
  res.send(req.todo); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res, next) => {
  try {
    req.todo.text = req.body?.text ?? req.todo.text;
    req.todo.done = req.body?.done ?? req.todo.done;

    await req.todo.save();
    res.send(req.todo); // Implement this
  } catch (error) {
    next(error);
  }
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
