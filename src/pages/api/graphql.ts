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
  context: ({req, res}) => {

    let user = null;
    const bearerLength = 'Bearer '.length;
    const token = req.headers.authorization || null;

    if (token && token.length > bearerLength) {
      user = jwt.decode(token.slice(bearerLength), process.env.JWT_KEY);
    }

    return { user, res };
  },
  formatError: (err) => {
    return {
      id: err.extensions.code.toUpperCase().replace(/ /g, '_'),
      message: err.message,
    };
  },
  formatResponse: (respose) => {
    return {
      data: respose.data,
      errors: respose.errors || null,
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
