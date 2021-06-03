const express = require('express');
const { ValidationError } = require('sequelize');
const { Voter, sequelize } = require('./models');

const app = express();
app.use(express.json());

const handle = async (operation, req, res, next) => {
  try {
    const result = await sequelize.transaction(async (txn) => operation(req, txn));
    if (!result) {
      res.sendStatus(404);
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
  await handle(async (req, txn) => Voter.findAll(
    { attributes: ['uuid', 'name', 'email']},
    { transaction: txn }),
    req, res, next);
});

app.get('/api/voters/:uuid', async (req, res, next) => {
  console.log(`getting voter ${req.params.uuid}`);
  await handle(async (req, txn) => Voter.findOne(
    { where: { uuid: req.params.uuid } },
    { transaction: txn }),
    req, res, next);
});

app.post('/api/voters', async (req, res, next) => {
  await handle(async (req, txn) => {
    const voter = await Voter.create(req.body, { transaction: txn });
    console.log(`Created voter ${voter.uuid}`);
    return voter;
  }, req, res, next);
});

app.put('/api/voters/:uuid', async (req, res, next) => {
  await handle(async (req, txn) => {
    await Voter.update(req.body, { where: { uuid: req.params.uuid } }, { transaction: txn });
    const voter = await Voter.findOne({ where: { uuid: req.params.uuid } }, { transaction: txn });
    return voter;
  }, req, res, next);
});

module.exports = app;
