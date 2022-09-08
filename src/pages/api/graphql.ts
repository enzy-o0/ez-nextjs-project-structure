import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-micro';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { PageConfig } from 'next';
import { getConnection } from 'typeorm';
import { User } from './models/entities/index';

let connectionReadyPromise: Promise<void> | null = null;

function prepareConnection() {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => {
      // clean up old connection that references outdated hot-reload classes
      try {
        const staleConnection = getConnection('default');

        await staleConnection.close();
      } catch (error) {
        // no stale connection to clean up
        // console.log(error);
      }

      // wait for new default connection
      // TODO
      // await createConnection({
      //   name: 'default',
      //   type: '',
      //   host: '',
      //   port: 3306,
      //   username: '',
      //   password: '@',
      //   database: '',
      //   synchronize: false,
      //   entities: [User],
      //   logging: 'all',
      // });
    })();
  }

  return connectionReadyPromise;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Origin', 'https://studio.apollographql.com');
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await prepareConnection();
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const apolloServer = new ApolloServer({
    // typeDefs,
    // resolvers,
    schema,
  });

  await apolloServer.start();
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
