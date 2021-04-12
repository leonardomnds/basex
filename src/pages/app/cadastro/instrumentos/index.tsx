import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';

import { makeStyles, Box, Paper, Tabs, Tab, Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/SearchRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';

import PageHeader from '../../../../components/Layout/PageHeader';

import TextField, {
  getEndItemIconButton,
} from '../../../../components/FormControl/TextField';

import CustomTable, { getColumn, getRow } from '../../../../components/Table';
import CustomDialog from '../../../../components/CustomDialog';
import { GetServerSideProps, NextPage } from 'next';
import api from '../../../../util/Api';
import { FormatarCpfCnpj, GetDataFromJwtToken, ZerosLeft } from '../../../../util/functions';
import ConsultaPessoas from '../../../../components/CustomDialog/ConsultaPessoas';

const useStyles = makeStyles((theme) => ({
  themeError: {
    color: theme.palette.background.paper,
  },
  paper: {
    padding: 20,
    marginBottom: 25,
  },
}));

type Props = {
  usuarioId: string,
  pessoaId: string,
  colunas: []
}

const List: NextPage<Props> = (props: Props) => {
  const classes = useStyles();
  const router = useRouter();
  const { addToast } = useToasts();
  const { usuarioId, pessoaId, colunas } = props;

  const [uuidPessoa, setUuidPessoa] = useState<string>(pessoaId);
  const [codPessoa, setCodPessoa] = useState<number>(null);
  const [cpfCnpjPessoa, setCpfCnpjPessoa] = useState<string>('');
  const [nomePessoa, setNomePessoa] = useState<string>('');
  const [consultandoPessoa, setConsultandoPessoa] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [deletingInstrument, setDeletingInstrument] = useState(null);
  const [linhas, setLinhas] = useState<Array<any>>([]);

  const setStateCpfCnpjPessoa = (str) => {
    setCpfCnpjPessoa(FormatarCpfCnpj(str));
  };

  const handleNewInstrument = () => {
    if (uuidPessoa) {
      router.push(`${router.pathname}/${uuidPessoa}/novo`);
    } else {
      addToast('É necessário selecionar o cliente!', { appearance: 'warning' });
    }    
  };

  const handleEditInstrument = (instrument) => {    
    if (uuidPessoa) {
      router.push(`${router.pathname}/${uuidPessoa}/${instrument.id}`);
    } else {
      addToast('É necessário selecionar o cliente!', { appearance: 'warning' });
    }  
  };

  const handleCloseDialog = () => {
    setDeletingInstrument(null);
  };

  const limparCamposPessoa = () => {
    setUuidPessoa('');
    setCodPessoa(null);
    setCpfCnpjPessoa('');
    setNomePessoa('');
  };

  const getEndItemBuscarCliente = () => {
    return getEndItemIconButton(
      uuidPessoa ? <CloseIcon /> : <SearchIcon />,
      uuidPessoa
        ? limparCamposPessoa
        : () => {
            setConsultandoPessoa(true);
          },
         uuidPessoa ? 'Remover seleção' : 'Consultar',
    );
  };

  const getDataPessoa = async (pesId: string) => {
    try {
      const response = await api.get(`/pessoas/${pesId}`);

      if (!response?.data?.error) {
        const { codigo, cpfCnpj, nome } = response.data;

        setCodPessoa(codigo),
        setCpfCnpjPessoa(cpfCnpj);
        setNomePessoa(nome);
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
  };

  useEffect(() => {

    const getData = async () => {
      const instrumentos = [];
      setLoading(true);

      try {
        const response = await api.get('/pessoas/'+uuidPessoa+'/instrumentos');

        if (!response?.data?.error) {
          response.data.forEach((i) => {
            
            instrumentos.push(
              getRow(
                [
                  i.id,
                  i.tag,
                  i.descricao,
                  i.ultimaCalibracao,
                  i.ativo ? 'Ativo' : 'Inativo',
                ],
                colunas,
              ),
            );
          });
        } else {
          throw new Error(response.data.error)
        }
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }

      setLinhas(instrumentos);
      setLoading(false);
    }

    if (uuidPessoa) {
      if (router.query?.pessoaId && Boolean(window)) {
        window.history.replaceState(null, '', router.pathname)
      }
      if (usuarioId) {
        getDataPessoa(uuidPessoa);
      }
      getData();
    } else {
      setLinhas([]);
    }
  }, [uuidPessoa])

  const getCamposBuscaCliente = () => {
    return (
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={3} md={2}>
            <TextField
              label="Cliente"
              value={codPessoa ? ZerosLeft(codPessoa.toString(), 4) : ''}
              setValue={setCodPessoa}
              disabled
              endItem={getEndItemBuscarCliente()}
            />
          </Grid>
          <Grid item xs={8} sm={5} md={3} lg={2}>
            <TextField
              label="CPF / CNPJ"
              value={cpfCnpjPessoa}
              setValue={setStateCpfCnpjPessoa}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={8}>
            <TextField
              label={`${
                cpfCnpjPessoa.length > 14 ? 'Razão Social' : 'Nome'
              } do cliente`}
              value={nomePessoa}
              setValue={setNomePessoa}
              disabled
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return (
      <Box>
        <PageHeader title="Instrumentos " btnLabel="Novo" btnFunc={handleNewInstrument} />
        {usuarioId && getCamposBuscaCliente()}
        <CustomTable
          isLoading={isLoading}
          columns={colunas}
          rows={linhas}
          editFunction={handleEditInstrument}
        />
        {deletingInstrument && (
          <CustomDialog
            title="Excluir instrumento"
            text={`Confirma a exclusão do instrumento ${deletingInstrument.nome}?`}
            isOpen={Boolean(deletingInstrument)}
            onClose={handleCloseDialog}
            onConfirm={()=>{}}
          />
        )}
        {consultandoPessoa && (
          <ConsultaPessoas
            isOpen={consultandoPessoa}
            onClose={() => setConsultandoPessoa(false)}
            setSelectedId={(pesId) => {
              setUuidPessoa(pesId);
              getDataPessoa(pesId);
            }}
          />
        )}
      </Box>
  );
}

export default List;

export const getServerSideProps : GetServerSideProps = async ({ req, query }) => {

  const colunas = [];
  colunas.push(getColumn('id', 'Id', 0, 'center', null, true));
  colunas.push(getColumn('tag', 'TAG', 50, 'left'));
  colunas.push(getColumn('descricao', 'Descrição', 100, 'left'));
  colunas.push(getColumn('dtCalibracao', 'Última Calibração', 50, 'center'));
  colunas.push(getColumn('ativo', 'Status', 30, 'center'));

  const { pessoaId } = query;
  const jwt = GetDataFromJwtToken(req.cookies.token);

  return {
    props: {
      usuarioId: jwt?.usuarioId || null,
      pessoaId: jwt?.pessoaId ? jwt.pessoaId : (pessoaId || null),
      colunas
    }
  }
}