canvass
---

canvass is a simple canvassing app built with React and Express.

It uses a SQLite file database for development and Postgres for production, along with Sequelize for ORM and Semantic UI React for styling.

## Running

canvass requires node and npm to run. It also depends on pg-native, which requires the postgres client libraries and tools to be installed.
Follow the instructions at https://www.npmjs.com/package/pg-native#install to set this up.

To start canvass in development mode, execute the following from the repository root:

```
npm run install-all
npm run dev
```
The app will be accessible at http://localhost:3000/.
