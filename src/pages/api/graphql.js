import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-micro';

import apiSchema from '../../db/config/graphqlSchema';
import apiController from '../../db/controllers';

require('../../db');

const apolloServer = new ApolloServer({
  typeDefs: apiSchema,
  resolvers: apiController,
  debug: false,
  playground: true, // Exibir a interface de teste no /api/graphql
  context: ({ req }) => {
    let user = null;
    const bearerLength = 'Bearer '.length;
    const token = req.headers.authorization || null;

    if (token && token.length > bearerLength) {
      user = jwt.decode(token.slice(bearerLength), process.env.JWT_KEY);
    }

    return { user };
  },
  formatError: (err) => {
    return {
      id: err.extensions.code.toUpperCase().replace(/ /g, '_'),
      detalhes: err.message,
    };
  },
  formatResponse: (dados) => {
    return {
      data: dados.data,
      errors: (dados.error ? dados.error.errors : dados.errors) || null,
      extensions: { serverDateTime: new Date(Date.now()).toISOString() },
    };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
