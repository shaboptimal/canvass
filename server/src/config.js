/**
 * Common configuration
 */
module.exports = {
  db: process.env.DATABASE_URL || 'sqlite://canvass.db',
  port: process.env.PORT || 5000,
};