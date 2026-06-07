import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// API URL comes from the Vite env (.env -> import.meta.env), not hardcoded.
// credentials: 'include' makes the browser send/receive the HttpOnly auth cookie,
// so the JWT is never read or stored by client-side JavaScript.
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: 'include',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
