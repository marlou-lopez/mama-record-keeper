import '@/styles/globals.css';
import { trpc } from '@/utils/trpc';
import {
  MantineProvider,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mama Record Keeper</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        theme={{
          fontFamily: 'Helvetica, sans-serif',
          primaryColor: 'violet',
          globalStyles(theme) {
            return {
              '::-webkit-scrollbar': {
                width: 8,
              },

              '::-webkit-scrollbar-track': {
                backgroundColor: theme.colors.violet[0],
                borderRadius: 12,
              },

              '::-webkit-scrollbar-thumb': {
                backgroundColor: theme.colors.violet[4],
                borderRadius: 12,
                opacity: 0.5,
              },
            };
          },
        }}
        withNormalizeCSS
        withGlobalStyles
      >
        <NotificationsProvider>
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}

export default trpc.withTRPC(App);
