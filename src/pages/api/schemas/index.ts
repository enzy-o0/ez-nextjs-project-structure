// import { gql } from 'apollo-server-express';
import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  scalar Date
  scalar POINT

  input UserType {
    name: String
    addr: String
    gender: String
    age: Int
  }

  type User {
    seq: Int
    id: String
    password: String
    phone: String
    name: String
    birth: Date
    addr: String
    email: String
    gender: String
  }

  type Query {
    users: [User!]
    user(seq: Int!): User
  }

  type Mutation {
    updateUser(seq: Int!, user: UserType): User
  }s
`;
