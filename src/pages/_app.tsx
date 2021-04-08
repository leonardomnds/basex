import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import { ToastProvider } from 'react-toast-notifications';
import CssBaseline from '@material-ui/core/CssBaseline';

import { theme2 } from '../theme';
import Toast, { ToastContainer } from '../components/Toast';
import Layout from '../components/Layout';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>BaseX</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme2}>
        <ToastProvider
          autoDismiss
          placement="top-right"
          components={{ Toast, ToastContainer }}
        >
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>          
        </ToastProvider>
      </ThemeProvider>
    </>
  );
}
