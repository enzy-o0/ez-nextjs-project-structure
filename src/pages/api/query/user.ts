import { gql } from '@apollo/client';

export const GET_USERS = gql`
  {
    users {
      seq
      id
      password
      phone
      name
      birth
      addr
      email
      gender
    }
  }
`;

export const GET_USER = gql`
  query User($seq: Int!) {
    user(seq: $seq) {
      phone
      name
      addr
      gender
      age
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($seq: Int!, $user: UserType!) {
    updateUser(seq: $seq, user: $user) {
      seq
    }
  }
`;
