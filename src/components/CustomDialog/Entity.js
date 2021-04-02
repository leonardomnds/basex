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
import api from '../../util/Api';
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

  const getEndpoint = () => {
    switch (entity) {
      case entMarcaProduto:
        return '/produtos/marcas';
      case entCategoriaProduto:
        return '/produtos/categorias';
      case entUnidadeMedida:
        return '/produtos/unidades';
      case entCategoriaPessoa:
        return '/pessoas/categorias';
      case entGrupoPessoa:
        return '/pessoas/grupos';
      case entCategoriaServico:
        return '/servicos/categorias';
      default:
        return '';
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

  const getFieldsJson = () => {
    if (entity === entUnidadeMedida) {
      return { simbolo: campo1, descricao: campo2 };
    }
    return { descricao: campo2 };
  };

  const clearFields = () => {
    setEditingEntity(null);
    setDeletingEntity(null);
    setCampo1('');
    setCampo2('');
  };

  const handleSaveEntity = async () => {
    try {
      let response;
      if (editingEntity) {
        response = await api.put(
          `${getEndpoint()}/${editingEntity.id}`,
          getFieldsJson(),
        );
      } else {
        response = await api.post(getEndpoint(), getFieldsJson());
      }

      if (response.data && response.data.sucesso) {
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
      if (!response.data) {
        throw new Error('Não foi possível se conectar ao servidor!');
      } else {
        addToast(response.data.erros, { appearance: 'error' });
      }
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
      const response = await api.delete(
        `${getEndpoint()}/${deletingEntity.id}`,
      );

      const { sucesso, dados, erros } = response.data;

      addToast(sucesso ? dados : erros, {
        appearance: sucesso ? 'success' : 'error',
      });

      if (sucesso) {
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
      const response = await api.get(getEndpoint());

      if (response.data.sucesso) {
        const { dados } = response.data;
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
        addToast(response.data.erros, { appearance: 'error' });
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
