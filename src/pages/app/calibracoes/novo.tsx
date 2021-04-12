import React, { useState } from 'react';
import { useRouter } from "next/router";
import { useToasts } from 'react-toast-notifications';

import { makeStyles, Box, Paper, Tabs, Tab, Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/SearchRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';

import PageHeader from '../../../components/Layout/PageHeader';

import TextField, { getEndItemIconButton } from '../../../components/FormControl/TextField';
import DatePicker from '../../../components/FormControl/DatePicker';

import { GetServerSideProps, NextPage } from 'next';
import api from '../../../util/Api';
import { FormatarCpfCnpj, GetDataFromJwtToken, ZerosLeft } from '../../../util/functions';
import ConsultaPessoas from '../../../components/CustomDialog/ConsultaPessoas';
import ConsultaInstrumentos from '../../../components/CustomDialog/ConsultaInstrumentos';
import { Calibracao } from '.prisma/client';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';

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
}

const List: NextPage<Props> = (props: Props) => {
  const classes = useStyles();
  const router = useRouter();
  const { addToast } = useToasts();
  const { usuarioId, pessoaId } = props;

  const [uuidPessoa, setUuidPessoa] = useState<string>(pessoaId);
  const [codPessoa, setCodPessoa] = useState<number>(null);
  const [cpfCnpjPessoa, setCpfCnpjPessoa] = useState<string>('');
  const [nomePessoa, setNomePessoa] = useState<string>('');
  const [consultandoPessoa, setConsultandoPessoa] = useState<boolean>(false);

  const [uuidInstrumento, setUuidInstrumento] = useState<string>('');
  const [tagInstrumento, setTagInstrumento] = useState<string>('');
  const [descricaoInstrumento, setDescricaoInstrumento] = useState<string>('');
  const [consultandoInstrumento, setConsultandoInstrumento] = useState<boolean>(false);

  const [dataCalibracao, setDataCalibracao] = React.useState<Date>(new Date());
  const [laboratorio, setLaboratorio] = useState<string>('');
  const [numeroCertificado, setNumeroCertificado] = useState<string>('');
  const [arquivoCertificado, setArquivoCertificado] = useState<string>('');

  const [isSaving, setSaving] = useState<boolean>(false);

  const setStateCpfCnpjPessoa = (str) => {
    setCpfCnpjPessoa(FormatarCpfCnpj(str));
  };

  const limparCamposPessoa = () => {
    setUuidPessoa('');
    setCodPessoa(null);
    setCpfCnpjPessoa('');
    setNomePessoa('');
    limparCamposInstrumento();
  };

  const limparCamposInstrumento = () => {
    setUuidInstrumento('');
    setTagInstrumento('');
    setDescricaoInstrumento('');
    setDataCalibracao(new Date());
    setLaboratorio('');
    setNumeroCertificado('');
    setArquivoCertificado('');
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

  const getEndItemBuscarInstrumento = () => {
    return getEndItemIconButton(
      uuidInstrumento ? <CloseIcon /> : <SearchIcon />,
      uuidInstrumento
        ? limparCamposInstrumento
        : () => {            
            if (uuidPessoa) {
              setConsultandoInstrumento(true);
            } else {
              addToast('É necessário selecionar o cliente!', { appearance: 'warning' });
            }
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

  const salvarCalibracao = async () => {
    setSaving(true);

    if (!uuidPessoa || !uuidInstrumento) {
      addToast('Selecione o cliente e o instrumento!', { appearance: 'warning' });
    } else if (!dataCalibracao) {
      addToast('Informe a data da calibração!', { appearance: 'warning' });
    } else if (!numeroCertificado) {
      addToast('Informe o número do certificado!', { appearance: 'warning' });
    } else {
      try {

        const calibracao : Calibracao = {
          id: null,
          instrumentoId: uuidInstrumento || null,
          dataCalibracao: dataCalibracao || null,
          numeroCertificado: numeroCertificado || null,
          arquivoCertificado: null,
          laboratorio: laboratorio || null,
          dataCadastro: null,
        };

        let response;
        if (false) { // Alteração ainda não criada
          response = await api.put('/pessoas/'+uuidPessoa+'/instrumentos/'+uuidInstrumento+'/calibracoes/'+calibracao.id, calibracao);
        } else {
          response = await api.post('/pessoas/'+uuidPessoa+'/instrumentos/'+uuidInstrumento+'/calibracoes', calibracao);
        }

        if (!response?.data?.error) {
          addToast(`Calibração ${calibracao.id ? 'alterada' : 'cadastrada'} com sucesso!`, {
            appearance: 'success',
          });
          limparCamposInstrumento();
        } else {
          throw new Error(response.data.error);
        }        
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }
    setSaving(false);
  }

  const getDataInstrumento = async (insId: string) => {
    try {
      const response = await api.get(`/pessoas/${uuidPessoa}/instrumentos/${insId}`);

      if (!response?.data?.error) {
        const { tag, descricao } = response.data;

        setTagInstrumento(tag);
        setDescricaoInstrumento(descricao);
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
  };

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

  const getCamposBuscaInstrumento = () => {
    return (
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={5} md={4}>
            <TextField
              label="Tag do Instrumento"
              value={tagInstrumento}
              setValue={setTagInstrumento}
              disabled
              endItem={getEndItemBuscarInstrumento()}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={8}>
            <TextField
              label="Descrição do Instrumento"
              value={descricaoInstrumento}
              setValue={setDescricaoInstrumento}
              disabled
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }

  const getCamposLancamentoCalibracao = () => {
    return (
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5} md={4} lg={3}>
            <DatePicker
              label="Data da calibração"
              value={dataCalibracao}
              maxValue={new Date()}
              setValue={setDataCalibracao}
            />
          </Grid>
          <Grid item xs={12} sm={7} md={8} lg={9}>
            <TextField
              label="Laboratório"
              value={laboratorio}
              setValue={setLaboratorio}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={4} lg={3}>
            <TextField
              label="Número do certificado"
              value={numeroCertificado}
              setValue={setNumeroCertificado}
            />
          </Grid>
          <Grid item xs={12} sm={7} md={8} lg={9}>
            <TextField
              label="Anexar certificado"
              value={arquivoCertificado}
              setValue={setArquivoCertificado}
              disabled
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Nova Calibração"
        btnLabel={uuidInstrumento ? "Salvar" : ''}
        btnIcon={<SaveRoundedIcon />}
        btnFunc={salvarCalibracao}
        btnLoading={isSaving}/>
      {usuarioId && getCamposBuscaCliente()}
      {getCamposBuscaInstrumento()}
      {uuidInstrumento && getCamposLancamentoCalibracao()}
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
      {consultandoInstrumento && (
        <ConsultaInstrumentos
          pessoaId={uuidPessoa}
          isOpen={consultandoInstrumento}
          onClose={() => setConsultandoInstrumento(false)}
          setSelectedId={(insId) => {
            setUuidInstrumento(insId);
            getDataInstrumento(insId);
          }}
        />
      )}
    </Box>
  );
}

export default List;

export const getServerSideProps : GetServerSideProps = async ({ req, query }) => {

  const { pessoaId } = query;
  const jwt = GetDataFromJwtToken(req.cookies.token);

  return {
    props: {
      usuarioId: jwt?.usuarioId || null,
      pessoaId: jwt?.pessoaId ? jwt.pessoaId : (pessoaId || null),
    }
  }
}