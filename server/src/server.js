const app = require('./app');
const { migrate } = require('./models');
const port = process.env.PORT || 5000;

migrate().then(() => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
});
