import next from 'next';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PROT || 3000;
const nextApp = next({ dev });
const nextRequestHandler = nextApp.getRequestHandler();

// apollo-server-express 사용을 위한 custom server
async function bootstrap() {
  await nextApp.prepare();
  const server = express();

  const { typeDefs } = require('./api/schemas/index');
  const { resolvers } = require('./api/resolvers/index');

  const apolloServer = new ApolloServer({
    typeDefs, // schema
    resolvers, // resolver
  });

  await apolloServer.start();
  await apolloServer.applyMiddleware({ app: server, path: '/api/graphql', cors: { credentials: true, origin: true } });

  server.get('*', (req, res) => {
    return nextRequestHandler(req, res);
  });

  server.listen(PORT, () => {
    console.log(`> ready @ Port http://localhost:${PORT}`);
    console.log(`GraphQL API @ ${apolloServer.graphqlPath}`);
  });
}

bootstrap();
