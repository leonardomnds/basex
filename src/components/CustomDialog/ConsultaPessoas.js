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
import { ZerosLeft } from '../../util/functions';

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

function ConsultaPessoas({ tipos, isOpen, onClose, setSelectedId }) {
  const classes = useStyles();
  const { addToast } = useToasts();

  const getTableColumns = () => {
    const zerosLeft = (value) => ZerosLeft(value, 6);
    const columns = [];
    columns.push(getColumn('id', 'Id', 0, 'center', null, true));
    columns.push(getColumn('codigo', 'Código', 30, 'center', zerosLeft));
    columns.push(getColumn('cpfCnpj', 'CPF/CNPJ', 50, 'left'));
    columns.push(getColumn('nome', 'Nome/Razão', 100, 'left'));
    columns.push(getColumn('fantasia', 'Apelido/Fantasia', 100, 'left'));
    return columns;
  };

  const [tableColumns] = useState(getTableColumns());
  const [tableRows, setTableRows] = useState([]);
  const [isLoading, setLoading] = useState([]);

  useEffect(async () => {
    setLoading(true);
    const rows = [];

    try {
      const response = await api.get('/pessoas');

      if (response.data.sucesso) {
        const { dados } = response.data;
        dados.forEach((pes) => {
          if (pes.ativo) {
            if (
              (tipos.includes('C') && pes.tipoCliente) ||
              (tipos.includes('F') && pes.tipoFornecedor) ||
              (tipos.includes('V') && pes.tipoVendedor)
            ) {
              rows.push(
                getRow(
                  [pes.id, pes.codigo, pes.cpfCnpj, pes.nome, pes.fantasia],
                  tableColumns,
                ),
              );
            }
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
      <DialogTitle onClose={onClose}>Consulta de Pessoas</DialogTitle>
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

ConsultaPessoas.prototypes = {
  // C: Cliente / F: Fornecedor / V: Vendedor
  tipos: PropTypes.string,
  isOpen: PropTypes.bool,
  setSelectedId: PropTypes.func.isRequired,
};

ConsultaPessoas.defaultProps = {
  tipos: 'C-F-V',
};

export default ConsultaPessoas;
