const config = require('../src/config.js');
config.db = 'sqlite::memory:';

const { Voter, sequelize } = require('models.js');
const { ValidationError } = require('sequelize');
const uuid = require('uuid');

describe('models', () => {

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  describe('Voter', () => {

    afterEach(async () => {
      await Voter.sync({ force: true });
    });

    test('Can insert valid voter', async () => {
      const voter = {
        id: 1,
        uuid: uuid.v4().toString(),
        name: 'Foo Bar',
        email: "baz@qux.quux",
        notes: "testing" 
      };
      const inserted = await Voter.create(voter);
      const retrieved = await Voter.findOne({ where: { id: 1 } });
      Object.keys(voter).forEach(k => {
        expect(voter[k]).toEqual(retrieved[k]);
        expect(voter[k]).toEqual(inserted[k]);
      });
    });

    test('Can update valid voter', async () => {
        try {
        const voter = {
          id: 1,
          uuid: uuid.v4().toString(),
          name: 'Foo Bar',
          email: "baz@qux.quux",
          notes: "testing" 
        };
        console.log('voter', voter);
        const newEmail = "qux@bar.foo";
        const newName = "Bar Foo";
        const inserted = await Voter.create(voter);
        console.log('inserted', inserted);
        const updated = await Voter.update({ email: newEmail, name: newName }, { where: { id: 1 } });
        console.log('updated', updated);
        const retrieved = await Voter.findOne({ where: { id: 1 } });
        console.log('retrieved', retrieved);
        Object.keys(voter).forEach(k => {
          if (k == 'name') {
            expect(retrieved[k]).toEqual(newName);
          } else if (k == 'email') {
            expect(retrieved[k]).toEqual(newEmail);
          } else {
            expect(voter[k]).toEqual(retrieved[k]);
          }
        });
      } catch(e) {
        console.error(e);
        throw e;
      }
    });

    test('Generates IDs', async () => {
      const voter = {
        name: 'Foo Bar',
        email: "baz@qux.quux",
        notes: "testing" 
      };
      const inserted = await Voter.create(voter);
      const retrieved = await Voter.findOne({ where: { id: 1 } });
      expect(retrieved.id).toBeTruthy();
      expect(retrieved.uuid).toBeTruthy();
    });


    test('Can\'t insert with invalid email', async () => {
      const voter = {
        id: 1,
        uuid: uuid.v4().toString(),
        name: 'Foo Bar',
        email: "not an email",
        notes: "testing" 
      };
      expect(Voter.create(voter)).rejects.toThrow(ValidationError);
    });

    test('Can\'t insert with invalid UUID', async () => {
      const voter = {
        id: 1,
        uuid: 'not a UUID',
        name: 'Foo Bar',
        email: "baz@qux.quux",
        notes: "testing" 
      };
      expect(Voter.create(voter)).rejects.toThrow(ValidationError);
    });

    test('Can\'t insert without name', async () => {
      expect(Voter.create({ name: null })).rejects.toThrow(ValidationError);
    });

    test('Can\'t update to invalid UUID', async () => {
      const voter = {
        id: 1,
        name: 'Foo Bar',
        email: "baz@qux.quux",
        notes: "testing" 
      };
      await Voter.create(voter);
      expect(Voter.update({ uuid: 'not a uuid' }, { where: { id: 1 } }))
        .rejects.toThrow(ValidationError);
    });

    test('Can\'t update to invalid email', async () => {
      const voter = {
        id: 1,
        name: 'Foo Bar',
        email: "baz@qux.quux",
        notes: "testing" 
      };
      await Voter.create(voter);
      expect(Voter.update({ email: 'not an email' }, { where: { id: 1 } }))
        .rejects.toThrow(ValidationError);
    });
  
  });

});
