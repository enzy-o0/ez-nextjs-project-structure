import { getSelectUsers } from '../database/user';
import { GraphQLScalarType, Kind } from 'graphql';

type updateUserProps = {
  seq: number;
  user: [];
};

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type YYYY-MM-DD',
    serialize(value: any) {
      return value; // Convert outgoing Date to integer for JSON
    },
    parseValue(value: any) {
      return value; // Convert incoming integer to Date
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
      }
      return null; // Invalid hard-coded value (not an integer)
    },
  }),
  POINT: new GraphQLScalarType({
    name: 'POINT',
    description: 'spacial datatype POINT { x: 0.0 , y: 0.0 }',
    serialize(value) {
      return value;
    },
    parseValue(value) {
      return value;
    },
    parseLiteral(ast: any) {
      return ast.value;
    },
  }),
  Query: {
    // users: () => models.user.findAll(),
    users: (_: any, { seq }: any) => getSelectUsers(seq),
  },
  Mutation: {
    // updateUser: async (_: any, { seq, user }: updateUserProps) => {
    //   return setUpdateUser(seq, user);
    // },
  },
};
