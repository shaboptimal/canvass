const config = require('./config');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.db);

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

const migrate = async (options = { alter: true }) => sequelize.sync(options);

module.exports = { migrate, Voter, voterType, sequelize };
