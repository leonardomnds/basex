import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';

import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';

import CustomTable, { getColumn, getRow } from '../Table';
import api from '../../util/Api';
import { DoubleToCurrency, ZerosLeft } from '../../util/functions';

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

function ConsultaProdutos({ isOpen, onClose, setSelectedId }) {
  const classes = useStyles();
  const { addToast } = useToasts();

  const getTableColumns = () => {
    const zerosLeft = (value) => ZerosLeft(value, 6);
    const moneyFormat = (value) => DoubleToCurrency(value);
    const columns = [];
    columns.push(getColumn('id', 'Id', 0, 'center', null, true));
    columns.push(getColumn('codigo', 'Código', 30, 'center', zerosLeft));
    columns.push(getColumn('sku', 'SKU', 50, 'left'));
    columns.push(getColumn('descricao', 'Descrição', 200, 'left'));
    columns.push(getColumn('custo', 'Custo', 50, 'right', moneyFormat));
    columns.push(getColumn('preco', 'Preço', 50, 'right', moneyFormat));
    columns.push(getColumn('estoque', 'Estoque', 30, 'center'));
    return columns;
  };

  const [tableColumns] = useState(getTableColumns());
  const [tableRows, setTableRows] = useState([]);
  const [isLoading, setLoading] = useState([]);

  useEffect(async () => {
    setLoading(true);
    const rows = [];

    try {
      const response = await api.get('/produtos');

      if (response.data.sucesso) {
        const { dados } = response.data;
        dados.forEach((pro) => {
          if (pro.ativo) {
            rows.push(
              getRow(
                [
                  pro.id,
                  pro.codigo,
                  pro.sku,
                  pro.descricao,
                  pro.custo,
                  pro.preco,
                  0,
                ],
                tableColumns,
              ),
            );
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
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle onClose={onClose}>Consulta de Produtos</DialogTitle>
      <DialogContent className={classes.box}>
        <CustomTable
          isLoading={isLoading}
          columns={tableColumns}
          rows={tableRows}
          maxHeight={300}
          selectFunction={(p) => {
            setSelectedId(p.id);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

ConsultaProdutos.prototypes = {
  isOpen: PropTypes.bool,
  setSelectedId: PropTypes.func.isRequired,
};

export default ConsultaProdutos;
