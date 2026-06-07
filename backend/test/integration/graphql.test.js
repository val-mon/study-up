import { jest } from '@jest/globals';
import { ObjectId } from 'mongodb';

// Integration tests: real GraphQL schema + resolvers + auth context wired
// together through ApolloServer. Only the database layer is mocked so the
// tests run without a live MongoDB.

jest.unstable_mockModule('../../src/utils/db.js', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  getDb: jest.fn(),
}));

const { getDb } = await import('../../src/utils/db.js');
const { ApolloServer } = await import('@apollo/server');
const typeDefs = (await import('../../src/graphql/schema.js')).default;
const resolvers = (await import('../../src/graphql/resolvers.js')).default;

let server;

beforeAll(() => {
  server = new ApolloServer({ typeDefs, resolvers });
});

function run(query, contextValue, variables) {
  return server.executeOperation({ query, variables }, { contextValue });
}

describe('GraphQL me query (integration)', () => {
  test('returns the user when authenticated', async () => {
    const id = new ObjectId();
    getDb.mockReturnValue({
      collection: () => ({
        findOne: async () => ({ _id: id, name: 'Alice', email: 'alice@example.com' }),
      }),
    });

    const res = await run('query { me { id name email } }', { user: { userId: id.toString() } });
    const single = res.body.singleResult;

    expect(single.errors).toBeUndefined();
    expect(single.data.me).toEqual({
      id: id.toString(),
      name: 'Alice',
      email: 'alice@example.com',
    });
  });

  test('rejects an unauthenticated request', async () => {
    const res = await run('query { me { id } }', { user: null });
    const single = res.body.singleResult;

    expect(single.data.me).toBeNull();
    expect(single.errors[0].message).toMatch(/Not authenticated/);
  });
});
