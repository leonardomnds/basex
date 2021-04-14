import React, { useState, useEffect } from 'react'
import listaRelatorios from '../../reports';
import { GetServerSideProps } from 'next';
import { PDFViewer } from '@react-pdf/renderer';

import ListaUsuarios from '../../reports/layouts/ListaUsuarios';
import ListaClientes from '../../reports/layouts/ListaClientes';
import { Box, CircularProgress, makeStyles } from '@material-ui/core';
import { NomeRelatorio } from '../../reports/nomesRelatorios';

const useStyles = makeStyles({
  pageContainer: {
    position: 'absolute',
    border: '0px',
    width: '100%',
    height: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9990,
  },
});

type Props = {
  data: [],
  relIndex: number,
  message: string,
}

const Pdf = (props: Props) => {
  const classes = useStyles();
  const { data, relIndex, message } = props;
  const [pdf, setPdf] = useState<JSX.Element>(null);

  useEffect(() => {    
    const gerarRelatorio = async () => {

      if (Boolean(window)) {
        window.history.replaceState(null, '', '/app/pdf')
      }

      switch (relIndex) {
        case NomeRelatorio.listaUsuarios:
          setPdf(<ListaUsuarios dados={data} />);
          break;
        case NomeRelatorio.listaClientes:
          setPdf(<ListaClientes dados={data} />);
          break;
        default:
          break;
      }
    }
    gerarRelatorio();
  }, [])

  const getViewer = () => {

    if (message.includes('Carregando') && !pdf) {
      return (
        <Box className={classes.loadingContainer}>
          <CircularProgress />
        </Box>
        );
    } else if (!data || !pdf) {
      return <h3>{message}</h3>
    }
    return (
      <PDFViewer className={classes.pageContainer}>
        { pdf }
      </PDFViewer>
    );
  }

  return getViewer();
}

export default Pdf;

export const getServerSideProps : GetServerSideProps = async ({ query: { ref }}) => {

  let relIndex: number = null;
  let data: any[] = null;
  let message = 'Carregando. Aguarde...';

  const rel = listaRelatorios.filter((v) => v.name.toString() === (ref || -1).toString())
  
  if (rel && rel[0]) {    
    relIndex = parseInt(ref.toString(), 10);
    data = await rel[0].getData();
    if (!data) {      
      message = 'Não há dados para exibir!';
    }
  } else {
    message = 'Use o sistema para gerar o relatório!';
  }
  
  return { props: { relIndex, data, message } }
}