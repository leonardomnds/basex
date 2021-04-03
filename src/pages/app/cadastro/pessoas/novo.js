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

import EntityDialog from '../../../../components/CustomDialog/Entity';
import CustomDialog from '../../../../components/CustomDialog';
import CustomTable, { getColumn, getRow } from '../../../../components/Table';
// import SelectTags, { getTag } from '../../../../components/FormControl/SelectTags';

import useApi from '../../../../services/useApi';

import {
  SomenteNumeros,
  FormatarCpfCnpj,
  FormatarCep,
  FormatarTelefone,
  ZerosLeft,
} from '../../../../util/functions';

// import useWindowSize from '../../../../util/WindowSize';

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

function NewPeople() {
  const classes = useStyles();
  // const theme = useTheme();
  // const size = useWindowSize();
  const router = useRouter();
  const { id } = router.query;

  const { addToast } = useToasts();

  // Geral
  const [isSaving, setSaving] = useState(false);
  const [isSavingContact, setSavingContact] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [newEntity, setNewEntity] = useState('');

  const [showConfirmCnpj, setShowConfirmCnpj] = useState(false);
  const [cnpjConsultado, setCnpjConsultado] = useState('');

  // Principal
  const [codigo, setCodigo] = useState('');
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
  // const [tiposCadastro, setTiposCadastro] = useState([]);

  // Endereço
  const [listaEstados, setListaEstados] = useState([]);
  const [listaCidades, setListaCidades] = useState([]);

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

  const getTableColumns = () => {
    const columns = [];
    columns.push(getColumn('id', 'Id', 0, 'center', null, true));
    columns.push(getColumn('nome', 'Nome', 100, 'left'));
    columns.push(getColumn('descricao', 'Descrição', 100, 'left'));
    columns.push(getColumn('telefone', 'Telefone', 50, 'center'));
    columns.push(getColumn('celular', 'Celular', 50, 'center'));
    columns.push(getColumn('email', 'E-mail', 100, 'left'));
    return columns;
  };

  const [tableColumns] = useState(getTableColumns());
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
      // } else if (tiposCadastro.length < 1) {
      //   addToast('Selecione pelo menos um tipo de cadastro!', {
      //     appearance: 'warning',
      //   });
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
        const contatos = [];
        tableRows.forEach((contato) => {
          contatos.push({
            nome: contato.nome,
            descricao: contato.descricao,
            telefone: contato.telefone,
            celular: contato.celular,
            email: contato.email,
          });
        });

        const response = await useApi.salvarPessoa(
          id || null,
          cpfCnpj || null,
          nomeRazao || null,
          fantasia || null,
          rgIe || null,
          inscMun || null,
          telefone || null,
          celular || null,
          email || null,
          cep || null,
          logradouro || null,
          numLogradouro || null,
          bairro || null,
          complemento || null,
          cidade || null,
          grupo || null,
          categoria || null,
          isAtivo,
          contatos,
        );

        /*
        tipoCliente: tiposCadastro.filter((tp) => tp.id === 'C').length > 0,
        tipoFornecedor:
          tiposCadastro.filter((tp) => tp.id === 'F').length > 0,
        tipoVendedor: tiposCadastro.filter((tp) => tp.id === 'V').length > 0,
        */

        if (!response.error) {
          // const contactOk = await savePersonContacts(response.data.dados.id);

          addToast(`Pessoa ${id ? 'alterada' : 'cadastrado'} com sucesso!`, {
            appearance: 'success',
          });
          router.push('/app/cadastro/pessoas');
          return;
        }
        throw new Error(response.error);
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    setSaving(false);
  };

  const findCnpjData = async () => {
    try {
      const response = await useApi.consultarCNPJ(cpfCnpj);

      if (!response.error) {
        const dados = response.data.consultarCnpj;
        if (dados) {
          // Dados Gerais
          setNomeRazao(dados.razaoSocial);
          setFantasia(dados.fantasia);

          if (dados.endereco) {
            // Endereço
            setCep(dados.endereco.cep);
            setBairro(dados.endereco.bairro);
            setComplemento(dados.endereco.complemento);

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

            if (dados.endereco.cidade) {
              setUF(dados.endereco.cidade.uf);
              setCidade(dados.endereco.cidade.id);
            }
          }
        }
      } else {
        throw new Error(response.error);
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
      const response = await useApi.consultarCEP(cep);

      if (!response.error) {
        const dados = response.data.consultarCep;
        if (dados) {
          setCep(dados.cep);
          setLogradouro(dados.logradouro);
          setBairro(dados.bairro);
          setComplemento(dados.complemento);

          if (dados.cidade) {
            setUF(dados.cidade.uf && dados.cidade.uf);
            setCidade(dados.cidade.id && dados.cidade.id);
          } else {
            setUF('');
            setCidade('');
          }
        }
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
    setCepConsultado(cep);
  };

  const handleCepData = async () => {
    if (SomenteNumeros(cep) === 8) {
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
      const response = await useApi.getGruposPessoas();

      if (!response.error) {
        const dados = response.data.gruposPessoa;
        if (dados) {
          const items = [];
          dados.forEach((item) => {
            items.push(getSelectItem(item.id, item.descricao));
          });
          setListaGrupos(items);
        }
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
  };

  const getCategorias = async () => {
    try {
      const response = await useApi.getCategoriasPessoas();

      if (!response.error) {
        const dados = response.data.categoriasPessoa;
        if (dados) {
          const items = [];
          dados.forEach((item) => {
            items.push(getSelectItem(item.id, item.descricao));
          });
          setListaCategorias(items);
        }
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
  };

  // Lista de Estados
  useEffect(() => {
    async function getData() {
      try {
        const response = await useApi.getListaEstados();

        if (!response.error) {
          const dados = response.data.estados;
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
          throw new Error(response.error);
        }
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    getData();
  }, []);

  // Lista de Cidades
  useEffect(() => {
    async function getData() {
      try {
        const response = await useApi.getCidadesByUF(uf);

        if (!response.error) {
          const dados = response.data.cidades;
          if (dados) {
            const cidades = [];
            dados.forEach((cid) => {
              cidades.push(getSelectItem(cid.id, cid.descricao));
            });
            setListaCidades(cidades);
          }
        } else {
          throw new Error(response.error);
        }
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    if (uf && uf.length === 2) {
      getData();
    } else {
      setListaCidades([]);
    }
  }, [uf]);

  useEffect(async () => {
    const rows = [];

    async function getData() {
      try {
        const response = await useApi.getPessoa(id);

        if (!response.error) {
          const dados = response.data.pessoa;
          if (dados) {
            // Dados Gerais
            setCodigo(
              dados.codigo ? ZerosLeft(dados.codigo.toString(), 6) : '',
            );
            setCpfCnpj(dados.cpfCnpj || '');
            setAtivo(dados.ativo);
            setNomeRazao(dados.nome || '');
            setFantasia(dados.fantasia || '');
            setRgIE(dados.rgInscEstadual || '');
            setInscMun(dados.inscMunicipal || '');
            setTelefone(dados.telefone || '');
            setCelular(dados.celular || '');
            setEmail(dados.email || '');
            if (dados.grupo) {
              setGrupo(dados.grupo.id);
            }
            if (dados.categoria) {
              setCategoria(dados.categoria.id);
            }
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
            if (dados.cidade) {
              setUF(dados.cidade.uf);
              setCidade(dados.cidade.id);
            }

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
                    tableColumns,
                  ),
                );
              });
            }
          } else {
            router.push('/app/cadastro/pessoas');
          }
        } else {
          if (response.error.includes('Variable "$id" got invalid value')) {
            router.push('/app/cadastro/pessoas');
            return;
          }
          throw new Error(response.error);
        }
      } catch (err) {
        addToast(err.message, { appearance: 'error' });
      }
    }

    setTableRows(rows);

    if (id) {
      getData();
    }

    getGrupos();
    getCategorias();
  }, [id]);

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
            <Grid item xs={12} sm={3} md={3}>
              <Select
                label="UF"
                value={uf}
                setValue={setUF}
                items={listaEstados}
              />
            </Grid>
            <Grid item xs={12} sm={9} md={5}>
              <Select
                label="Cidade"
                value={cidade}
                setValue={setCidade}
                items={listaCidades}
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
                    className={classes.btn}
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
                columns={tableColumns}
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
                  setNewEntity('grupoPessoa');
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
                  setNewEntity('categoriaPessoa');
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
        title={`${id ? 'Editar' : 'Novo'} cliente`}
        btnLabel="Salvar"
        btnIcon={<SaveRoundedIcon />}
        btnFunc={handleSave}
        btnLoading={isSaving}
        btnBack
      />
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={2} sm={2} md={2}>
            <TextField label="Código" value={codigo} disabled />
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
          <Tab label="Contatos" />
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
              case 'grupoPessoa':
                getGrupos();
                break;
              case 'categoriaPessoa':
                getCategorias();
                break;
              default:
                break;
            }
            setNewEntity('');
          }}
        />
      )}
    </Box>
  );
}

export default NewPeople;
