const app = require('./app');
const { sequelize } = require('./models');
const { port } = require('./config');

/*
 * Server entry point. Perform any database migrations, then listen for requests.
 */
sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
});
