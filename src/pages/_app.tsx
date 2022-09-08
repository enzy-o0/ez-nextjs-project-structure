import type { NextComponentType } from 'next';
import type { AppProps } from 'next/app';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { SessionProvider } from 'next-auth/react';
import { ApolloProvider } from '@apollo/client';
import themes from '@src/components/Layouts/themes';
import SimpleLayout from '@src/components/Layouts/SimpleLayout';
import AuthLayout from '@src/components/molecule/AuthLayout';
import client from './apolloClient';

export type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean };
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) {
  return (
    <>
      <ApolloProvider client={client}>
        <SessionProvider
          session={session} // Re-fetches session when window is focused
        >
          <ThemeProvider theme={themes('default', 'ltr')}>
            <SimpleLayout />
            <>
              {Component.auth ? (
                <AuthLayout role={Component.auth}>
                  <Component {...pageProps} />
                </AuthLayout>
              ) : (
                <>
                  <Component {...pageProps} />
                </>
              )}
            </>
          </ThemeProvider>
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
