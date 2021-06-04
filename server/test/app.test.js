const config = require('../src/config.js');
config.db = 'sqlite::memory:';

const { ValidationError, TEXT } = require('sequelize');
const request = require('supertest');
const uuid = require('uuid');
const app = require('../src/app.js');
const { Voter } = require('../src/models.js');

const TEST_VOTER = Voter.build({
  id: 1,
  uuid: uuid.v4(),
  name: 'Foo Bar',
  email: 'foo@bar.baz',
  notes: 'Some notes',
});

describe('app', () => {

  describe('GET /api/voters', () => {

    test('Returns 200 and voters', async () => {
      const voterList = [TEST_VOTER];
      Voter.findAll = jest.fn().mockReturnValue(voterList);
      const response = await request(app).get('/api/voters');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(voterList.map(v => v.toJSON()));
      expect(response.headers['content-type']).toMatch(/^application\/json/);
    });
  
    test('Returns 200 and empty list', async () => {
      const voterList = [];
      Voter.findAll = jest.fn().mockReturnValue(voterList);
      const response = await request(app).get('/api/voters');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(voterList.map(v => v.toJSON()));
      expect(response.headers['content-type']).toMatch(/^application\/json/);
    });
  
    test('Returns 500 on error', async () => {
      const voterList = [];
      Voter.findAll = jest.fn().mockImplementation(() => { throw new Error(); });
      const response = await request(app).get('/api/voters');
      expect(response.statusCode).toBe(500);
    });

    test('Returns 200 and CSV when requested', async () => {
      const voterList = [TEST_VOTER];
      Voter.findAll = jest.fn().mockReturnValue(voterList);
      let csv = Object.keys(TEST_VOTER.toJSON()).map(k => `"${k}"`).join(',');
      csv += '\n';
      csv += Object.values(TEST_VOTER.toJSON()).map(v => typeof v === 'number' ? v : `"${v}"`).join(',');
      const response = await request(app).get('/api/voters').query({ format: 'csv', download: 'true' });
      expect(response.status).toBe(200);
      expect(response.text).toEqual(csv);
      expect(response.headers['content-type']).toMatch(/^text\/csv/);
      expect(response.headers['content-disposition']).toEqual('attachment; filename=voters.csv');
    });

    test('Returns 200 and JSON when requested', async () => {
      const voterList = [TEST_VOTER];
      Voter.findAll = jest.fn().mockReturnValue(voterList);
      const response = await request(app).get('/api/voters').query({ format: 'json', download: 'true' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(voterList.map(v => v.toJSON()));
      expect(response.headers['content-type']).toMatch(/^application\/json/);
      expect(response.headers['content-disposition']).toEqual('attachment; filename=voters.json');
    });
  
  });

  describe('GET /api/voters/:uuid', () => {
    
    test('Returns 200 and a voter', async () => {
      Voter.findOne = jest.fn().mockReturnValue(TEST_VOTER);
      const response = await request(app).get(`/api/voters/${TEST_VOTER.uuid}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(TEST_VOTER.toJSON());
      expect(response.headers['content-type']).toMatch(/^application\/json/);
    });

    test('Returns 404 for no voters', async () => {
      Voter.findOne = jest.fn().mockReturnValue(null);
      const response = await request(app).get(`/api/voters/${TEST_VOTER.uuid}`);
      expect(response.statusCode).toBe(404);
    });

    test('Returns 500 on error', async () => {
      Voter.findOne = jest.fn().mockImplementation(() => { throw new Error(); });
      const response = await request(app).get(`/api/voters/${TEST_VOTER.uuid}`);
      expect(response.statusCode).toBe(500);
    });

  });

  describe('POST /api/voters', () => {
    
    test('Returns 201 and a voter on successful insert', async () => {
      Voter.create = jest.fn().mockReturnValue(TEST_VOTER);
      const response = await request(app).post('/api/voters').send(TEST_VOTER);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(TEST_VOTER.toJSON());
      expect(response.headers['content-type']).toMatch(/^application\/json/);
    });

    test('Returns 400 on ValidationError', async () => {
      Voter.create = jest.fn().mockImplementation(() => { throw new ValidationError('INVALID'); });
      const response = await request(app).post('/api/voters').send(TEST_VOTER);
      expect(response.statusCode).toBe(400);
      expect(response.text).toEqual('INVALID');
    });

    test('Returns 500 on other error', async () => {
      Voter.create = jest.fn().mockImplementation(() => { throw new Error(); });
      const response = await request(app).post('/api/voters').send(TEST_VOTER);
      expect(response.statusCode).toBe(500);
    });

  });

  describe('PUT /api/voters/:uuid', () => {
    
    test('Returns 200 and a voter on successful update', async () => {
      Voter.update = jest.fn().mockReturnValue(1);
      Voter.findOne = jest.fn().mockReturnValue(TEST_VOTER);
      const response = await request(app).put(`/api/voters/${TEST_VOTER.uuid}`).send(TEST_VOTER);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(TEST_VOTER.toJSON());
      expect(response.headers['content-type']).toMatch(/^application\/json/);
    });

    test('Returns 400 on ValidationError', async () => {
      Voter.update = jest.fn().mockImplementation(() => { throw new ValidationError('INVALID'); });
      const response = await request(app).put(`/api/voters/${TEST_VOTER.uuid}`).send(TEST_VOTER);
      expect(response.statusCode).toBe(400);
      expect(response.text).toEqual('INVALID');
    });

    test('Returns 404 when voter is not found', async () => {
      Voter.update = jest.fn().mockReturnValue(0);
      Voter.findOne = jest.fn();
      const response = await request(app).put(`/api/voters/${TEST_VOTER.uuid}`).send(TEST_VOTER);
      expect(response.statusCode).toBe(404);
    });

    test('Returns 500 on other error', async () => {
      Voter.update = jest.fn().mockImplementation(() => { throw new Error(); });
      const response = await request(app).put(`/api/voters/${TEST_VOTER.uuid}`).send(TEST_VOTER);
      expect(response.statusCode).toBe(500);
    });

  });

});