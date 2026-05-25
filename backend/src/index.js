require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const db = require('./utils/db');

const app = express();
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL }));

// error handling middleware, must be last
app.use((err, req, res, next) => {
  console.error(`ERROR [${req.method} ${req.originalUrl}]:`, err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    route: `${req.method} ${req.path}`,
    message: err.message,
  });
});

if (require.main === module) {
  const server = new ApolloServer({ typeDefs, resolvers });

  db.connect()
    .then(async () => {
      await server.start();
      app.use('/graphql', expressMiddleware(server));

      app.listen(process.env.PORT, () => {
        console.log(`INFO : Server running on port ${process.env.PORT}`);
        console.log(`INFO : GraphQL endpoint at http://localhost:${process.env.PORT}/graphql`);
      });
    })
    .catch((err) => {
      console.error('INFO : Failed to start server:', err.message);
      process.exit(1);
    });
}

module.exports = app;
