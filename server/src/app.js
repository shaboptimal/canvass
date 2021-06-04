const express = require('express');
const { ValidationError } = require('sequelize');
const { Voter, sequelize } = require('./models');

const app = express();
app.use(express.json());

/*
 * Helper function to support common CRUD endpoints. Performs an operation
 * in a transaction, and sends:
 * 
 *   - successStatus and the value returned from operation, if successful
 *   - 404 if the operation returns null or undefined
 *   - 400 if the operation throws a ValidationError
 *   - 500 if the operation throws another error.
 * 
 * Parameters:
 * 
 *   - operation (function) - async fucntion that accepts a request and a transaction,
 *     performs some database operations within that transaction, and returns a result.
 *   - req (Request) - the request.
 *   - res (Response) - the response.
 *   - next (function) - function to pass control to the next handler.
 *   - successStatus (integer) - HTTP status to return in case of success.
 * 
 */
const handle = async (operation, req, res, next, successStatus = 200) => {
  try {
    const result = await sequelize.transaction(async (txn) => operation(req, txn));
    if (result === null || result === undefined) {
      res.sendStatus(404);
    } else {
      res.status(successStatus).send(result);
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

/*
 * Get all voters. Returns only the UUID, name, and email for each.
 */ 
app.get('/api/voters', async (req, res, next) => {
  console.log(`getting names and IDs for all voters`);
  await handle(async (req, txn) => Voter.findAll(
    { attributes: ['uuid', 'name', 'email']},
    { transaction: txn }),
    req, res, next);
});

/*
 * Get a voter by UUID
 */
app.get('/api/voters/:uuid', async (req, res, next) => {
  console.log(`getting voter ${req.params.uuid}`);
  await handle(async (req, txn) => Voter.findOne(
    { where: { uuid: req.params.uuid } },
    { transaction: txn }),
    req, res, next);
});

/*
 * Create a voter
 */
app.post('/api/voters', async (req, res, next) => {
  await handle(async (req, txn) => {
    const voter = await Voter.create(req.body, { transaction: txn });
    console.log(`Created voter ${voter.uuid}`);
    return voter;
  }, req, res, next, 201);
});

/*
 * Update a voter
 */
app.put('/api/voters/:uuid', async (req, res, next) => {
  await handle(async (req, txn) => {
    await Voter.update(req.body, { where: { uuid: req.params.uuid } }, { transaction: txn });
    const voter = await Voter.findOne({ where: { uuid: req.params.uuid } }, { transaction: txn });
    return voter;
  }, req, res, next);
});

module.exports = app;
