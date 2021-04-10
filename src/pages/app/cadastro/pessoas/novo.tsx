import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';

import {
  // useTheme,
  makeStyles,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Hidden,
} from '@material-ui/core';

import CachedIcon from '@material-ui/icons/CachedRounded';

import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import PageHeader from '../../../../components/Layout/PageHeader';
import TextField, {
  getEndItemIconButton,
} from '../../../../components/FormControl/TextField';
import Select, {
  getSelectItem,
} from '../../../../components/FormControl/Select';
import CustomButton from '../../../../components/CustomButton';

import EntityDialog, { Entity } from '../../../../components/CustomDialog/Entity';
import CustomDialog from '../../../../components/CustomDialog';
import CustomTable, { getColumn, getRow } from '../../../../components/Table';

import api from '../../../../util/Api';

import {
  SomenteNumeros,
  FormatarCpfCnpj,
  FormatarCep,
  FormatarTelefone,
  ZerosLeft,
} from '../../../../util/functions';
import { GetServerSideProps, NextPage } from 'next';
import { CategoriaPessoa, GrupoPessoa, Pessoa } from '.prisma/client';

const { v4: uuidv4 } = require('uuid');

const useStyles = makeStyles((theme) => ({
  themeError: {
    color: theme.palette.background.paper,
  },
  paper: {
    padding: 20,
    marginBottom: 25,
  },
  tabs: {
    marginTop: 25,
  },
  tab: {
    paddingTop: 25,
  },
  btnContact: {
    width: '100%',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btn: {
    marginRight: 10,
  },
}));

type Props = {
  pessoaId: string,
  colunas: [],
}

const NewPeople: NextPage<Props> = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const { pessoaId, colunas } = props;

  const { addToast } = useToasts();

  // Geral
  const [isSaving, setSaving] = useState(false);
  const [isSavingContact, setSavingContact] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [newEntity, setNewEntity] = useState<Entity>(null);

  const [showConfirmCnpj, setShowConfirmCnpj] = useState(false);
  const [cnpjConsultado, setCnpjConsultado] = useState('');

  // Principal
  const [codigo, setCodigo] = useState<number>(null);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [nomeRazao, setNomeRazao] = useState('');
  const [fantasia, setFantasia] = useState('');
  const [isAtivo, setAtivo] = useState(true);

  // Dados gerais
  const [listaGrupos, setListaGrupos] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);

  const [rgIe, setRgIE] = useState('');
  const [inscMun, setInscMun] = useState('');
  const [grupo, setGrupo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');

  // Endereço
  const [listaEstados, setListaEstados] = useState([]);

  const [showConfirmCep, setShowConfirmCep] = useState(false);
  const [cep, setCep] = useState('');
  const [cepConsultado, setCepConsultado] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numLogradouro, setNumLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [uf, setUF] = useState('');
  const [cidade, setCidade] = useState('');
  const [complemento, setComplemento] = useState('');

  // Contatos
  const [listaContatosPost, setListaContatosPost] = useState([]);
  const [listaContatosPut, setListaContatosPut] = useState([]);
  const [listaContatosDelete, setListaContatosDelete] = useState([]);

  const [contEnable, setContEnable] = useState(false);
  const [contEditId, setContEditId] = useState('');
  const [contNome, setContNome] = useState('');
  const [contDescricao, setContDescricao] = useState('');
  const [contTelefone, setContTelefone] = useState('');
  const [contCelular, setContCelular] = useState('');
  const [contEmail, setContEmail] = useState('');

  const [tableRows, setTableRows] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const limparCamposContatos = () => {
    setContEditId('');
    setContNome('');
    setContDescricao('');
    setContTelefone('');
    setContCelular('');
    setContEmail('');
  };

  const hadleEditContact = (contact) => {
    limparCamposContatos();
    setContEditId(contact.id);
    setContNome(contact.nome);
    setContDescricao(contact.descricao);
    setContTelefone(contact.telefone);
    setContCelular(contact.celular);
    setContEmail(contact.email);

    setContEnable(true);
  };

  const handleDeleteContact = (person) => {
    const rows = [];
    const rowsDel = [];

    listaContatosDelete.forEach((row) => {
      rowsDel.push(row);
    });

    tableRows.forEach((row) => {
      if (row.id !== person.id) {
        rows.push(row);
      } else if (!person.id.includes('POST')) {
        // Se id tem POST, não precisa deletar na Api pois é novo
        rowsDel.push(row);
      }
    });

    setListaContatosDelete(rowsDel);
    setTableRows(rows);
  };

  const handleSaveContact = async () => {
    setSavingContact(true);
    const contactJson = {
      id: contEditId,
      nome: contNome,
      descricao: contDescricao,
      telefone: contTelefone,
      celular: contCelular,
      email: contEmail,
    };

    const rows = [];

    if (!contEditId || contEditId.includes('POST-')) {
      const rowsPost = [];

      // Cria um ID para possíveis edições antes de gravar
      if (contEditId.length === 0) {
        const uuid = `POST-${uuidv4()}`;
        contactJson.id = uuid;
      }

      // Inclui na lista que será feito POST para API
      rowsPost.push(contactJson);

      // Inclui também os que já tinha
      listaContatosPost.forEach((row) => {
        if (row.id !== contactJson.id) {
          rowsPost.push(row);
        }
      });

      setListaContatosPost(rowsPost);
    } else {
      const rowsPut = [];
      // Inclui na lista que será feito PUT na API
      rowsPut.push(contactJson);

      listaContatosPut.forEach((row) => {
        // Inclui na lista apenas os demais itens
        if (row.id !== contactJson.id) {
          rowsPut.push(row);
        }
      });

      setListaContatosPut(rowsPut);
    }

    rows.push(contactJson);

    tableRows.forEach((row) => {
      if (row.id !== contactJson.id) {
        rows.push(row);
      }
    });

    setTableRows(rows);

    setContEnable(false);
    limparCamposContatos();

    setSavingContact(false);
  };
  /*
  const savePersonContacts = async (personId) => {
    const baseUrl = `/pessoas/${personId}/contatos`;
    let response;
    let sucesso = true;
    try {
      const promissePost = listaContatosPost.map(async (con) => {
        response = await api.post(baseUrl, con);
        if (!response || !response.data || !response.data.sucesso) {
          sucesso = false;
        }
      });
      const promissePut = listaContatosPut.map(async (con) => {
        response = await api.put(`${baseUrl}/${con.id}`, con);
        if (!response || !response.data || !response.data.sucesso) {
          sucesso = false;
        }
      });
      const promisseDel = listaContatosDelete.map(async (con) => {
        response = await api.delete(`${baseUrl}/${con.id}`);
        if (!response || !response.data || !response.data.sucesso) {
          sucesso = false;
        }
      });
      await Promise.all(promissePost);
      await Promise.all(promissePut);
      await Promise.all(promisseDel);
      return sucesso;
    } catch (err) {
      return false;
    }
  };
*/
  const handleSave = async () => {
    setSaving(true);

    if (!cpfCnpj || !nomeRazao) {
      addToast(
        `Preencha CPF/CNPJ e ${
          cpfCnpj.length > 14 ? 'Razão Social' : 'Nome'
        } para continuar!`,
        {
          appearance: 'warning',
        },
      );
    } else if (cpfCnpj && cpfCnpj.length !== 18 && cpfCnpj.length !== 14) {
      addToast('O CPF/CNPJ está incompleto!', {
        appearance: 'warning',
      });
    } else if (cep && cep.length !== 9) {
      addToast('O CEP está incompleto!', {
        appearance: 'warning',
      });
    } else if (uf && !cidade) {
      addToast('Selecione a cidade!', {
        appearance: 'warning',
      });
    } else {
      try {

        const person : Pessoa = {
          id: pessoaId || null,
          codigo: codigo || null,
          cpfCnpj: cpfCnpj || null,
          nome: nomeRazao || null,
          fantasia: fantasia || null,
          rgInscEstadual: rgIe || null,
          inscMunicipal: inscMun || null,
          telefone: telefone || null,
          celular: celular || null,
          email: email || null,
          cep: cep || null,
          logradouro: logradouro || null,
          numero: numLogradouro || null,
          bairro: bairro || null,
          complemento: complemento || null,
          cidade: cidade || null,
          uf: uf || null,
          grupoId: grupo || null,
          categoriaId: categoria || null,
          ativo: isAtivo,
          dataCadastro: null,
          usuarioId: null,
        };

        let response;
        if (person.id) {
          response = await api.put('/pessoas/'+person.id, person);
        } else {
          response = await api.post('/pessoas', person);
        }

        if (!response?.data?.error) {
          addToast(`Pessoa ${pessoaId ? 'alterada' : 'cadastrado'} com sucesso!`, {
            appearance: 'success',
          });
          router.push('/app/cadastro/pessoas');
          return;
        }
        throw new Error(response.data.error);
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    setSaving(false);
  };

  const findCnpjData = async () => {
    try {
      const response = await api.get('/cnpj/'+SomenteNumeros(cpfCnpj));

      if (!response?.data?.error) {
        const dados = response.data;
        if (dados) {
          // Dados Gerais
          setNomeRazao(dados.razaoSocial);
          setFantasia(dados.fantasia);

          if (dados.endereco) {
            // Endereço
            setCep(dados.endereco.cep);
            setBairro(dados.endereco.bairro);
            setComplemento(dados.endereco.complemento);
            setUF(dados.endereco.uf);
            setCidade(dados.endereco.cidade);

            if (dados.endereco.logradouro.includes('|')) {
              setLogradouro(
                dados.endereco.logradouro.slice(
                  dados.endereco.logradouro.indexOf('|') + 1,
                ),
              );
              setNumLogradouro(
                dados.endereco.logradouro.substring(
                  0,
                  dados.endereco.logradouro.indexOf('|'),
                ),
              );
            } else {
              setLogradouro(dados.endereco.logradouro);
              setNumLogradouro('');
            }
          }
        }
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
    setCnpjConsultado(cpfCnpj);
  };

  const handleCnpjData = async () => {
    if (SomenteNumeros(cpfCnpj).length !== 14) {
      addToast('Preencha o CNPJ para continuar!', { appearance: 'warning' });
    } else if (cpfCnpj === cnpjConsultado) {
      setShowConfirmCnpj(true);
    } else {
      findCnpjData();
    }
  };

  const findCepData = async () => {
    try {
      const response = await api.get('/cep/'+cep);

      if (!response?.data?.error) {
        const dados = response.data;
        if (dados) {
          setCep(dados.cep);
          setLogradouro(dados.logradouro);
          setBairro(dados.bairro);
          setComplemento(dados.complemento);
          setUF(dados.uf);
          setCidade(dados.cidade);
        }
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
    setCepConsultado(cep);
  };

  const handleCepData = async () => {
    if (SomenteNumeros(cep).length !== 8) {
      addToast('Preencha o CEP para continuar!', { appearance: 'warning' });
    } else if (cep === cepConsultado) {
      setShowConfirmCep(true);
    } else {
      findCepData();
    }
  };

  const getEndItemCnpj = () =>
    getEndItemIconButton(<CachedIcon />, handleCnpjData);

  const getEndItemCep = () =>
    getEndItemIconButton(<CachedIcon />, handleCepData);

  const maskCpfCnpj = (str) => {
    setCpfCnpj(FormatarCpfCnpj(str));
  };

  const maskCep = (str) => {
    setCep(FormatarCep(str));
  };

  const maskTelefone = (str) => {
    setTelefone(FormatarTelefone(str));
  };

  const maskCelular = (str) => {
    setCelular(FormatarTelefone(str));
  };

  const maskTelefoneContato = (str) => {
    setContTelefone(FormatarTelefone(str));
  };

  const maskCelularContato = (str) => {
    setContCelular(FormatarTelefone(str));
  };

  // const getLimitTagsTipos = () => {
  //   if (size.width <= theme.breakpoints.values.xs) {
  //     return -1;
  //   }
  //   if (size.width < theme.breakpoints.values.sm) {
  //     return 3;
  //   }
  //   if (size.width <= theme.breakpoints.values.md) {
  //     return 1;
  //   }
  //   return -1;
  // };

  const getGrupos = async () => {
    try {
      const response = await api.get('/pessoas/grupos');

      if (!response?.data?.error) {
        const dados : GrupoPessoa[] = response.data;
        if (dados) {
          const items = [];
          dados.forEach((item) => {
            items.push(getSelectItem(item.id, item.descricao));
          });
          setListaGrupos(items);
        }
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
  };

  const getCategorias = async () => {
    try {
      const response = await api.get('/pessoas/categorias');

      if (!response?.data?.error) {
        const dados : CategoriaPessoa[] = response.data;
        if (dados) {
          const items = [];
          dados.forEach((item) => {
            items.push(getSelectItem(item.id, item.descricao));
          });
          setListaCategorias(items);
        }
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
  };

  // Lista de Estados
  useEffect(() => {
    async function getData() {
      try {
        const response = await api.get('/estados');

        if (!response?.data?.error) {
          const dados = response.data;
          if (dados) {
            const estados = [];
            dados.forEach((estado) => {
              estados.push(
                getSelectItem(estado.uf, `${estado.uf} - ${estado.descricao}`),
              );
            });
            setListaEstados(estados);
          }
        } else {
          throw new Error(response.data.error);
        }
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    getData();
  }, []);

  useEffect(() => {
    const rows = [];

    async function getData() {
      try {
        const response = await api.get('/pessoas/'+pessoaId);

        if (!response?.data?.error) {
          const dados = response.data;
          if (dados) {
            // Dados Gerais
            setCodigo(dados.codigo);
            setCpfCnpj(dados.cpfCnpj || '');
            setAtivo(dados.ativo);
            setNomeRazao(dados.nome || '');
            setFantasia(dados.fantasia || '');
            setRgIE(dados.rgInscEstadual || '');
            setInscMun(dados.inscMunicipal || '');
            setTelefone(dados.telefone || '');
            setCelular(dados.celular || '');
            setEmail(dados.email || '');
            setGrupo(dados.grupoId || '');
            setCategoria(dados.categoriaId || '');
            /*
            const tipos = [];
            if (dados.tipoCliente) {
              tipos.push(getTag('C', 'Cliente'));
            }
            if (dados.tipoFornecedor) {
              tipos.push(getTag('F', 'Fornecedor'));
            }
            if (dados.tipoVendedor) {
              tipos.push(getTag('V', 'Vendedor'));
            }
            setTiposCadastro(tipos);
*/
            // Endereço
            setCep(dados.cep || '');
            setCepConsultado(dados.cep || '');
            setLogradouro(dados.logradouro || '');
            setNumLogradouro(dados.numeroLogradouro || '');
            setBairro(dados.bairro || '');
            setComplemento(dados.complementoLogradouro || '');
            setUF(dados.uf);
            setCidade(dados.cidade);

            // Contatos
            if (dados.contatos) {
              dados.contatos.forEach((con) => {
                rows.push(
                  getRow(
                    [
                      con.id,
                      con.nome,
                      con.descricao,
                      con.telefone,
                      con.celular,
                      con.email,
                    ],
                    colunas,
                  ),
                );
              });
            }
          } else {
            router.push('/app/cadastro/pessoas');
          }
        } else {
          if (response.data.error.includes('Variable "$id" got invalid value')) {
            router.push('/app/cadastro/pessoas');
            return;
          }
          throw new Error(response.data.error);
        }
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    setTableRows(rows);

    if (pessoaId) {
      getData();
    }

    getGrupos();
    getCategorias();
  }, []);

  const TablePanel = () => {
    switch (currentTab) {
      case 1: // Endereço
        return (
          <Grid container spacing={2}>
            <Grid item xs={8} sm={6} md={3}>
              <TextField
                label="CEP"
                value={cep}
                setValue={maskCep}
                endItem={cep.length === 9 ? getEndItemCep() : null}
              />
            </Grid>
            <Grid item xs={4} sm={6} md={9} />
            <Grid item xs={12} sm={8} md={9}>
              <TextField
                label="Logradouro"
                value={logradouro}
                setValue={setLogradouro}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Número"
                value={numLogradouro}
                setValue={setNumLogradouro}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField label="Bairro" value={bairro} setValue={setBairro} />
            </Grid>
            <Grid item xs={12} sm={9} md={5}>
              <TextField label="Cidade" value={cidade} setValue={setCidade} />
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Select
                label="UF"
                value={uf}
                setValue={setUF}
                items={listaEstados}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Complemento"
                value={complemento}
                setValue={setComplemento}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Box className={classes.btnContact}>
              {!contEnable && (
                <Box className={classes.btn}>
                  <CustomButton
                    //className={classes.btn}
                    label="Novo contato"
                    func={() => {
                      setContEnable(true);
                      limparCamposContatos();
                    }}
                  />
                </Box>
              )}
              {contEnable && (
                <Box className={classes.btn}>
                  <CustomButton
                    color="secondary"
                    label="Voltar à lista"
                    func={() => {
                      setContEnable(false);
                      limparCamposContatos();
                    }}
                  />
                </Box>
              )}
              {contEnable && (
                <Box className={classes.btn}>
                  <CustomButton
                    label="Salvar Contato"
                    isLoading={isSavingContact}
                    func={() => {
                      handleSaveContact();
                    }}
                  />
                </Box>
              )}
            </Box>
            {!contEnable && (
              <CustomTable
                columns={colunas}
                rows={tableRows}
                editFunction={hadleEditContact}
                deleteFunction={handleDeleteContact}
                naoPreencherLinhasVazias
              />
            )}
            {contEnable && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nome"
                    value={contNome}
                    setValue={setContNome}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Descrição"
                    value={contDescricao}
                    setValue={setContDescricao}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    label="Telefone"
                    value={contTelefone}
                    setValue={maskTelefoneContato}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    label="Celular"
                    value={contCelular}
                    setValue={maskCelularContato}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    label="E-mail"
                    value={contEmail}
                    setValue={setContEmail}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        );
      default:
        // Dados gerais
        return (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={3}>
              <TextField
                label={cpfCnpj.length > 14 ? 'Inscrição Estadual' : 'RG'}
                value={rgIe}
                setValue={setRgIE}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              {cpfCnpj.length > 14 && (
                <TextField
                  label="Inscrição Municipal"
                  value={inscMun}
                  setValue={setInscMun}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Select
                label="Grupo"
                value={grupo}
                setValue={setGrupo}
                items={listaGrupos}
                btnAction={() => {
                  setNewEntity(Entity.grupoPessoa);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Select
                label="Categoria"
                value={categoria}
                setValue={setCategoria}
                items={listaCategorias}
                btnAction={() => {
                  setNewEntity(Entity.categoriaPessoa);
                }}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <TextField
                label="Telefone principal"
                value={telefone}
                setValue={maskTelefone}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <TextField
                label="Celular principal"
                value={celular}
                setValue={maskCelular}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                label="E-mail principal"
                value={email}
                setValue={setEmail}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6} md={6}>
              <SelectTags
                label="Tipo de Cadastro"
                limitTags={getLimitTagsTipos()}
                value={tiposCadastro}
                setValue={setTiposCadastro}
                items={[
                  getTag('C', 'Cliente'),
                  getTag('F', 'Fornecedor'),
                  getTag('V', 'Vendedor'),
                ]}
              />
            </Grid> */}
          </Grid>
        );
    }
  };

  return (
      <Box>
        <PageHeader
          title={`${pessoaId ? 'Editar' : 'Novo'} cliente`}
          btnLabel="Salvar"
          btnIcon={<SaveRoundedIcon />}
          btnFunc={handleSave}
          btnLoading={isSaving}
          btnBack
        />
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={2} sm={2} md={2}>
              <TextField label="Código" value={ZerosLeft(codigo, 4)} disabled />
            </Grid>
            <Grid item xs={7} sm={6} md={4}>
              <TextField
                label="CPF / CNPJ"
                value={cpfCnpj}
                setValue={maskCpfCnpj}
                endItem={cpfCnpj.length === 18 ? getEndItemCnpj() : null}
              />
            </Grid>
            <Hidden xsDown>
              <Grid item xs={1} sm={1} md={4} />
            </Hidden>
            <Grid item xs={3} sm={3} md={2}>
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
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                label={cpfCnpj.length > 14 ? 'Razão Social' : 'Nome'}
                value={nomeRazao}
                setValue={setNomeRazao}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                label={cpfCnpj.length > 14 ? 'Nome Fantasia' : 'Apelido'}
                value={fantasia}
                setValue={setFantasia}
              />
            </Grid>
          </Grid>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            className={classes.tabs}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Dados gerais" />
            <Tab label="Endereço" />
            {/* <Tab label="Contatos" /> */}
          </Tabs>
          <Box className={classes.tab}>{TablePanel()}</Box>
        </Paper>
        {showConfirmCnpj && (
          <CustomDialog
            title="Consultar CNPJ"
            text="O CNPJ não foi alterado desde a última consulta. Continuar mesmo assim?"
            isOpen={showConfirmCnpj}
            onClose={() => {
              setShowConfirmCnpj(false);
            }}
            onConfirm={() => {
              setShowConfirmCnpj(false);
              findCnpjData();
            }}
          />
        )}
        {showConfirmCep && (
          <CustomDialog
            title="Consultar CEP"
            text="O CEP não foi alterado desde a última consulta. Continuar mesmo assim?"
            isOpen={showConfirmCep}
            onClose={() => {
              setShowConfirmCep(false);
            }}
            onConfirm={() => {
              setShowConfirmCep(false);
              findCepData();
            }}
          />
        )}
        {newEntity && (
          <EntityDialog
            entity={newEntity}
            isOpen={Boolean(newEntity)}
            onClose={() => {
              switch (newEntity) {
                case Entity.grupoPessoa:
                  getGrupos();
                  break;
                case Entity.categoriaPessoa:
                  getCategorias();
                  break;
                default:
                  break;
              }
              setNewEntity(null);
            }}
          />
        )}
      </Box>
  );
}

export default NewPeople;

export const getServerSideProps : GetServerSideProps = async ({ params }) => {

  const colunas = [];
  colunas.push(getColumn('id', 'Id', 0, 'center', null, true));
  colunas.push(getColumn('nome', 'Nome', 100, 'left'));
  colunas.push(getColumn('descricao', 'Descrição', 100, 'left'));
  colunas.push(getColumn('telefone', 'Telefone', 50, 'center'));
  colunas.push(getColumn('celular', 'Celular', 50, 'center'));
  colunas.push(getColumn('email', 'E-mail', 100, 'left'));

  return {
    props: {
      pessoaId: params?.id || null,
      colunas
    }
  }
}