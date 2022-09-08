import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { NextApiRequest } from 'next';
import { GET_USERS } from '@src/pages/api/query/user';
import client from '@src/pages/apolloClient';
// import crypto from 'crypto';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      id: 'ADMIN',
      name: 'ADMIN',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        id: { label: '아이디', type: 'text', placeholder: '' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials: any) {
        const { data } = await client.query({
          query: GET_USERS,
        });

        // Add logic here to look up the user from the credentials supplied
        // console.log('토큰확인', credentials);

        const user = data?.users?.filter((e: any) => {
          return e.id === credentials.id;
        });

        //TODO 살려야함
        // const createPwSha2 = await crypto
        //   .createHash('sha256')
        //   .update(credentials.password + user[0].seq)
        //   .digest('hex');

        // const name = data.user_name;
        // const password = credentials.password;

        //TODO 살려야함
        // if (createPwSha2 === user[0].password) {
        if (credentials.password == 'test') {
          // Any object returned will be saved in `user` property of the JWT
          return true;
        } else {
          throw new Error('아이디 혹은 패스워드가 틀립니다.');
          // If you return null or false then the credentials will be rejected
          //   return null;
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
