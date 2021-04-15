import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';

import {
  makeStyles,
  Box,
  Paper,
  Grid,
  Avatar,
  Hidden,
} from '@material-ui/core';

import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import PageHeader from '../../../../components/Layout/PageHeader';
import TextField from '../../../../components/FormControl/TextField';
import Select from '../../../../components/FormControl/Select';

import CustomButton from '../../../../components/CustomButton';

import api from '../../../../util/Api';

import { GetServerSideProps, NextPage } from 'next';
import { Usuario } from '.prisma/client';

const useStyles = makeStyles((theme) => ({
  themeError: {
    color: theme.palette.background.paper,
  },
  paper: {
    padding: 20,
  },
  avatarItems: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    margin: 10,
  },
  btn: {
    marginTop: 10,
    marginBottom: 5,
    width: 150,
  },
  input: {
    display: 'none',
  }
}));

type Props = {
  usuarioId: string
}

const NewUser: NextPage<Props> = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const { usuarioId } = props;

  const { addToast } = useToasts();

  // Geral
  const [isSaving, setSaving] = useState(false);
  const [nome, setNome] = useState<string>('');
  const [usuario, setUsuario] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [isAtivo, setAtivo] = useState<boolean>(true);
  const [avatar, setAvatar] = useState<{file: any, preview: any}>(null);

  const setSelectAvatar = (evt) => {
    setAvatar({
      file: evt?.target?.files[0],
      preview: URL.createObjectURL(evt?.target?.files[0])
    });
  }
 
  const handleSave = async () => {
    setSaving(true);

    if (!nome || !usuario || !senha) {
      addToast(
        "Nome, usuário e senha são campos obrigatórios!",
        {
          appearance: 'warning',
        },
      );
    } else {
      try {

        const user : Usuario = {
          id: usuarioId,
          nome,
          usuario,
          senha,
          ativo: isAtivo,
          data_cadastro: null,
        };

        let response;
        if (user.id) {
          response = await api.put('/usuarios/'+user.id, user);
        } else {
          response = await api.post('/usuarios', user);
        }

        if (!response?.data?.error) {
          addToast(`Usuário ${usuarioId ? 'alterado' : 'cadastrado'} com sucesso!`, {
            appearance: 'success',
          });
          router.push('/app/cadastro/usuarios');
          return;
        }
        throw new Error(response.data.error);
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    setSaving(false);
  };

  useEffect(() => {
    async function getData() {
      try {
        const response = await api.get('/usuarios/'+usuarioId);

        if (!response?.data?.error) {
          const u : Usuario = response.data;
          if (u) {
            // Dados Gerais
            setNome(u.nome);
            setUsuario(u.usuario);
            setSenha('********');
            setAtivo(u.ativo);

          } else {
            router.push('/app/cadastro/usuarios');
          }
        } else {
          throw new Error(response.data.error);
        }
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    if (usuarioId) {
      getData();
    }

  }, []);

  const getAvatarBox = () => {
    return (
      <Paper className={classes.paper}>
        <Box className={classes.avatarItems}>
          <Avatar
            className={classes.avatar}
            src={avatar ? avatar.preview : '/'}
          />
          <input
            accept="image/*"
            className={classes.input}
            onChange={(evt) => setSelectAvatar(evt)}
            id="inputAvatar"
            type="file"
          />
          <label htmlFor="inputAvatar">
            <CustomButton
              className={classes.btn}
              label='Selecionar foto'
              color='secondary'
              size='small'
              componentSpan
            />
          </label>
          <CustomButton
            className={classes.btn}
            label='Remover foto'
            color='primary'
            size='small'
            variant="text"
            func={() => setAvatar(null)}
          />
        </Box>
      </Paper>
    );
  }

  const getSelectSituacao = () => {
    return (
      <Grid item xs={12} md={4} lg={3} xl={2}>
        <Select
          label="Situação"
          value={isAtivo}
          setValue={setAtivo}
          itemZero={false}
          items={[
            { value: true, text: 'Ativo' },
            { value: false, text: 'Inativo' },
          ]}
        />
      </Grid>
    );
  }

  const getFieldsBox = () => {
    return (
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} lg={9} xl={10}>
            <TextField
              label="Nome"
              value={nome}
              setValue={setNome}
            />
          </Grid>
          <Hidden smDown>
            {getSelectSituacao()}
          </Hidden>
          <Grid item xs={12} md={6}>
            <TextField
              label="Usuário"
              value={usuario}
              setValue={setUsuario}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Senha"
              value={senha}
              setValue={setSenha}
              type="password"
            />
          </Grid>
          <Hidden mdUp>
            {getSelectSituacao()}
          </Hidden>
        </Grid>
      </Paper>
    );
  }

  return (
      <Box>
        <PageHeader
          title={`${usuarioId ? 'Editar' : 'Novo'} usuário`}
          btnLabel="Salvar"
          btnIcon={<SaveRoundedIcon />}
          btnFunc={handleSave}
          btnLoading={isSaving}
          btnBack
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5} lg={3}>
            {getAvatarBox()}
          </Grid>
          <Grid item xs={12} sm={7} lg={9}>
            {getFieldsBox()}
          </Grid>
        </Grid>
      </Box>
  );
}

export default NewUser;

export const getServerSideProps : GetServerSideProps = async ({ params }) => {
  return {
    props: {
      usuarioId: params?.id || null,
    }
  }
}