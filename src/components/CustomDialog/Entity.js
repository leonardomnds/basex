import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';

import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Paper,
  DialogActions,
  Button,
} from '@material-ui/core';

import CustomTable, { getColumn, getRow } from '../Table';
import useApi from '../../services/useApi';
import CustomDialog from '.';
import TextField from '../FormControl/TextField';

const useStyles = makeStyles((theme) => ({
  themeError: {
    color: theme.palette.background.paper,
  },
  paper: {
    padding: 20,
    marginTop: 25,
    marginBottom: 25,
  },
}));

const entMarcaProduto = 'marcaProduto';
const entCategoriaProduto = 'categoriaProduto';
const entUnidadeMedida = 'unidadeMedida';
const entGrupoPessoa = 'grupoPessoa';
const entCategoriaPessoa = 'categoriaPessoa';
const entCategoriaServico = 'categoriaServico';

function EntityDialog({ entity, isOpen, onClose }) {
  const classes = useStyles();
  const { addToast } = useToasts();

  const getTitle = () => {
    switch (entity) {
      case entMarcaProduto:
        return 'Marcas';
      case entCategoriaPessoa:
      case entCategoriaProduto:
      case entCategoriaServico:
        return 'Categorias';
      case entUnidadeMedida:
        return 'Unidades de Medida';
      case entGrupoPessoa:
        return 'Grupos';
      default:
        return 'Entidades';
    }
  };

  const getFunctionConsulta = () => {
    switch (entity) {
      case entMarcaProduto:
        return '/produtos/marcas';
      case entCategoriaProduto:
        return '/produtos/categorias';
      case entUnidadeMedida:
        return '/produtos/unidades';
      case entCategoriaPessoa:
        return useApi.getCategoriasPessoas;
      case entGrupoPessoa:
        return useApi.getGruposPessoas;
      case entCategoriaServico:
        return '/servicos/categorias';
      default:
        return () => {};
    }
  };

  const getFunctionSalvar = () => {
    switch (entity) {
      case entMarcaProduto:
        return '/produtos/marcas';
      case entCategoriaProduto:
        return '/produtos/categorias';
      case entUnidadeMedida:
        return '/produtos/unidades';
      case entCategoriaPessoa:
        return useApi.salvarCategoriaPessoa;
      case entGrupoPessoa:
        return useApi.salvarGrupoPessoa;
      case entCategoriaServico:
        return '/servicos/categorias';
      default:
        return () => {};
    }
  };

  const getFunctionDeletar = () => {
    switch (entity) {
      case entMarcaProduto:
        return '/produtos/marcas';
      case entCategoriaProduto:
        return '/produtos/categorias';
      case entUnidadeMedida:
        return '/produtos/unidades';
      case entCategoriaPessoa:
        return useApi.deletarCategoriaPessoa;
      case entGrupoPessoa:
        return useApi.deletarGrupoPessoa;
      case entCategoriaServico:
        return '/servicos/categorias';
      default:
        return () => {};
    }
  };

  const getResponseObject = () => {
    switch (entity) {
      case entMarcaProduto:
        return null;
      case entCategoriaProduto:
        return null;
      case entUnidadeMedida:
        return null;
      case entCategoriaPessoa:
        return 'categoriasPessoa';
      case entGrupoPessoa:
        return 'gruposPessoa';
      case entCategoriaServico:
        return null;
      default:
        return null;
    }
  };

  const getNumberFields = () => {
    if (entity === entUnidadeMedida) {
      return 2;
    }
    return 1;
  };

  const getTableColumns = () => {
    const upperFormat = (value) => value.toUpperCase();

    const columns = [];
    columns.push(getColumn('id', 'Id', 0, 'center', null, true));
    if (entity === entUnidadeMedida) {
      columns.push(getColumn('simbolo', 'Símbolo', 50, 'center', upperFormat));
    }
    columns.push(getColumn('descricao', 'Descrição', 200, 'left'));
    return columns;
  };

  const [tableColumns] = useState(getTableColumns());
  const [tableRows, setTableRows] = useState([]);
  const [isLoading, setLoading] = useState([]);
  const [findAgain, setFindAgain] = useState([]);
  const [editingEntity, setEditingEntity] = useState(null);
  const [deletingEntity, setDeletingEntity] = useState(null);

  const [campo1, setCampo1] = useState('');
  const [campo2, setCampo2] = useState('');

  const clearFields = () => {
    setEditingEntity(null);
    setDeletingEntity(null);
    setCampo1('');
    setCampo2('');
  };

  const handleSaveEntity = async () => {
    try {
      const func = getFunctionSalvar();

      let response;

      if (entity === entUnidadeMedida) {
        response = await func({
          id: editingEntity ? editingEntity.id : null,
          simbolo: campo1,
          descricao: campo2, // descricao
        });
      } else {
        response = await func({
          id: editingEntity ? editingEntity.id : null,
          descricao: campo2, // descricao
        });
      }

      if (!response?.data?.error) {
        clearFields();
        setFindAgain(!findAgain);
        addToast(
          `${
            editingEntity ? 'Alteração realizada' : 'Cadastrado'
          } com sucesso!`,
          {
            appearance: 'success',
          },
        );
        return;
      }
      throw new Error(response.data.error);
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
  };

  const handleEditEntity = (ent) => {
    if (ent.simbolo) {
      setCampo1(ent.simbolo);
    }
    setCampo2(ent.descricao);
    setEditingEntity(ent);
  };

  const handleDeleteEntity = (ent) => {
    setDeletingEntity(ent);
  };

  const handleCloseDialog = () => {
    setDeletingEntity(null);
  };

  const confirmDelete = async () => {
    try {
      const func = getFunctionDeletar();
      const response = await func(deletingEntity.id);

      addToast(
        !response?.data?.error ? 'Registro eliminado com sucesso!' : response.data.error,
        {
          appearance: !response?.data?.error ? 'success' : 'error',
        },
      );

      if (!response?.data?.error) {
        const rows = [];

        tableRows.forEach((row) => {
          if (row.id !== deletingEntity.id) {
            rows.push(row);
          }
        });

        setTableRows(rows);
      }

      clearFields();

      handleCloseDialog();
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
  };

  useEffect(async () => {
    setLoading(true);
    const rows = [];

    try {
      const func = getFunctionConsulta();
      const response = await func();

      if (!response?.data?.error) {
        const dados = response.data.data?.[getResponseObject()];
        dados.forEach((item) => {
          if (entity === entUnidadeMedida) {
            rows.push(
              getRow([item.id, item.simbolo, item.descricao], tableColumns),
            );
          } else {
            rows.push(getRow([item.id, item.descricao], tableColumns));
          }
        });
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }

    setTableRows(rows);
    setLoading(false);
  }, [findAgain]);

  return (
    <Box>
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle onClose={onClose}>Cadastro de {getTitle()}</DialogTitle>
        <DialogContent className={classes.box}>
          <Box>
            <CustomTable
              isLoading={isLoading}
              columns={tableColumns}
              rows={tableRows}
              maxHeight={300}
              editFunction={handleEditEntity}
              deleteFunction={handleDeleteEntity}
              linhasPorPagina={5}
            />
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                {getNumberFields() > 1 && (
                  <Grid item xs={3}>
                    <TextField
                      label="Símbolo"
                      type="text"
                      name="campo1"
                      value={campo1}
                      setValue={setCampo1}
                    />
                  </Grid>
                )}
                <Grid item xs={getNumberFields() > 1 ? 9 : 12}>
                  <TextField
                    label="Descrição"
                    type="text"
                    name="campo2"
                    value={campo2}
                    setValue={setCampo2}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSaveEntity}
            color="primary"
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      {deletingEntity && (
        <CustomDialog
          title={`Excluir ${getTitle()}`}
          text="Confirma a exclusão? Caso possua vínculos no sistema, será feita a inativação."
          isOpen={Boolean(deletingEntity)}
          onClose={handleCloseDialog}
          onConfirm={confirmDelete}
        />
      )}
    </Box>
  );
}

EntityDialog.prototypes = {
  entity: PropTypes.oneOf([
    entMarcaProduto,
    entCategoriaProduto,
    entUnidadeMedida,
    entGrupoPessoa,
    entCategoriaPessoa,
    entCategoriaServico,
  ]),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default EntityDialog;
