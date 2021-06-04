const express = require('express');
const { ValidationError } = require('sequelize');
const { Voter, sequelize } = require('./models');
const { Parser } = require('json2csv');

const app = express();
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const DEFAULT_HEADERS = { 'content-type': 'application/json' };

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
 *   - successStatus (integer) - HTTP status to return if successful.
 *   - headers (object) - response headers to include if successful.
 * 
 */
const handle = async (
  operation,
  req,
  res,
  next,
  successStatus = 200,
  headers,
  ) => {
  try {
    const result = await sequelize.transaction(async (txn) => operation(req, txn));
    if (result === null || result === undefined) {
      res.sendStatus(404);
    } else {
      res.set({ ...DEFAULT_HEADERS, ...headers }).status(successStatus).send(result);
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
 * Get all voters as JSON or CSV.
 */ 
app.get('/api/voters', async (req, res, next) => {
  console.log(`getting names and IDs for all voters`);
  const { format = 'json', download } = req.query;
  const headers = {};
  if (format === 'csv') {
    headers['content-type'] = 'text/csv';
  }
  if (req.query.download) {
    headers['content-disposition'] = `attachment; filename=voters.${format}`;
  }
  await handle(async (req, txn) => {
    const voters = await Voter.findAll({}, { transaction: txn });
    if (format === 'csv') {
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(voters.map(v => v.toJSON()));
      return csv;
    }
    return voters;
  }, req, res, next, 200, headers);
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

/*
 * Get all voters as CSV.
 */ 
app.get('/api/voters/csv', async (req, res, next) => {
  console.log(`getting all voters as CSV`);
  const headers = { 'content-type': 'application/csv', 'content-disposition': 'attachment' };
  await handle(async (req, txn) => {
    const voters = await Voter.findAll({}, { transaction: txn });
  }, req, res, next, 200, headers);
});

module.exports = app;
