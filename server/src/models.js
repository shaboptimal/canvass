const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

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

const migrate = async () => sequelize.sync({ alter: true });

module.exports = { migrate, Voter, voterType };
