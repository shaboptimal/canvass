const config = require('./config');
const { Sequelize, DataTypes } = require('sequelize');
const options = process.env.NODE_ENV === 'production'
  ? {
    dialect: 'postgres',
    ssl: true,
    native: true,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  } : { dialect: 'sqlite' };
const sequelize = new Sequelize(config.db, options);

/**
 * Database models.
 */

const voterType = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    validate: {
      isUUID: 4,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
};

const Voter = sequelize.define('Voter', voterType);

module.exports = { Voter, voterType, sequelize };
