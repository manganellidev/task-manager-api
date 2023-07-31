const { Router } = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/task");

const router = new Router();

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const [property, orderDirection] = req.query.sortBy.split(":");
    sort[property] = orderDirection === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit || 10),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: "Resource Not Found." });
    }

    res.send(task);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((field) =>
    allowedUpdates.includes(field)
  );

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ error: "Invalid operation. Please, inform valid fields." });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: "Resource Not Found." });
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    const savedTask = await task.save();

    res.send(savedTask);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndRemove({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.sendStatus(204);
    }

    res.send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
