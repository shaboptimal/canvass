const express = require('express');
const { ValidationError } = require('sequelize');
const { migrate, Voter } = require('./models');

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

const handle = async (operation, req, res, next) => {
  try {
    const result = await operation(req);
    if (!result) {
      res.sendStatus(400);
    } else {
      res.send(result);
    }
  } catch (err) {
    console.error(err);
    if (err instanceof ValidationError) {
      res.status(400).send(err.message);
    } else {
      return next(err);
    }
  }
}

app.get('/api/voters', async (req, res, next) => {
  console.log(`getting names and IDs for all voters`);
  await handle(async () =>  Voter.findAll({ attributes: ['uuid', 'name', 'email']}), req, res, next);
});

app.get('/api/voters/:uuid', async (req, res, next) => {
  console.log(`getting voter ${req.params.uuid}`);
  await handle(async (req) => Voter.findOne({ where: { uuid: req.params.uuid } }), req, res, next);
});

app.post('/api/voters', async (req, res, next) => {
  await handle(async (req) => {
    const voter = await Voter.create(req.body);
    console.log(`Created voter ${voter.uuid}`);
    return voter;
  }, req, res, next);
});

app.put('/api/voters/:uuid', async (req, res, next) => {
  await handle(async (req) => {
    await Voter.update(req.body, { where: { uuid: req.params.uuid } });
    const voter = await Voter.findOne({ where: { uuid: req.params.uuid } });
    return voter;
  }, req, res, next);
});

migrate().then(() => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
});
