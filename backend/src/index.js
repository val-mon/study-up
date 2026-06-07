import 'dotenv/config';
import { fileURLToPath } from 'url';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import * as db from './utils/db.js';
import { verifyToken } from './utils/auth.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));
// credentials: true is required so the browser sends/receives the HttpOnly auth cookie
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// error handling middleware, must be last
app.use((err, req, res, next) => {
  console.error(`ERROR [${req.method} ${req.originalUrl}]:`, err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    route: `${req.method} ${req.path}`,
    message: err.message,
  });
});

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  const server = new ApolloServer({ typeDefs, resolvers });

  db.connect()
    .then(async () => {
      await server.start();
      app.use('/graphql', expressMiddleware(server, {
        context: async ({ req, res }) => {
          // The JWT now travels in an HttpOnly cookie instead of the Authorization header.
          const token = req.cookies?.token;
          const user = token ? verifyToken(token) : null;
          return { user, res };
        },
      }));

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

export default app;
