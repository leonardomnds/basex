import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';

import { Box } from '@material-ui/core';
import PageHeader from '../../../../components/Layout/PageHeader';

import CustomTable, { getColumn, getRow } from '../../../../components/Table';
import useApi from '../../../../services/useApi';
import CustomDialog from '../../../../components/CustomDialog';
import { ZerosLeft } from '../../../../util/functions';

function ProductList() {
  const router = useRouter();
  const { addToast } = useToasts();

  const handleNewPerson = () => {
    router.push(`${router.pathname}/novo`);
  };

  const handleEditPerson = (person) => {
    router.push(`${router.pathname}/${person.id}`);
  };

  const getTableColumns = () => {
    const zerosLeft = (value) => ZerosLeft(value, 6);
    const columns = [];
    columns.push(getColumn('id', 'Id', 0, 'center', null, true));
    columns.push(getColumn('codigo', 'Código', 30, 'center', zerosLeft));
    columns.push(getColumn('cpfCnpj', 'CPF/CNPJ', 50, 'left'));
    columns.push(getColumn('nome', 'Nome/Razão', 100, 'left'));
    columns.push(getColumn('fantasia', 'Apelido/Fantasia', 100, 'left'));
    columns.push(getColumn('endereco', 'Endereço', 100, 'left'));
    columns.push(getColumn('ativo', 'Status', 30, 'center'));
    return columns;
  };

  const [tableColumns] = useState(getTableColumns());
  const [tableRows, setTableRows] = useState([]);
  const [isLoading, setLoading] = useState([]);
  const [deletingPerson, setDeletingPerson] = useState(null);

  // const handleDeletePerson = (person) => {
  //   setDeletingPerson(person);
  // };

  const handleCloseDialog = () => {
    setDeletingPerson(null);
  };

  const confirmDeleteProduct = async () => {
    try {
      const response = null; // await useApi.delete(`/pessoas/${deletingPerson.id}`);

      const { sucesso, dados, erros } = response.data;

      addToast(sucesso ? dados : erros, {
        appearance: sucesso ? 'success' : 'error',
      });

      if (sucesso) {
        const rows = [];

        tableRows.forEach((row) => {
          if (row.id !== deletingPerson.id) {
            rows.push(row);
          }
        });

        setTableRows(rows);
      }

      handleCloseDialog();
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }
  };

  useEffect(async () => {
    setLoading(true);
    const rows = [];

    try {
      const response = await useApi.getListaPessoas();

      if (!response.error) {
        response.data.pessoas.forEach((pes) => {
          rows.push(
            getRow(
              [
                pes.id,
                pes.codigo,
                pes.cpfCnpj,
                pes.nome,
                pes.fantasia,
                `${pes.logradouro || ''}, ${pes.numeroLogradouro || ''}`,
                pes.ativo ? 'Ativo' : 'Inativo',
              ],
              tableColumns,
            ),
          );
        });
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      addToast(err.message, { appearance: 'error' });
    }

    setTableRows(rows);
    setLoading(false);
  }, []);

  return (
    <Box>
      <PageHeader title="Clientes" btnLabel="Novo" btnFunc={handleNewPerson} />
      <CustomTable
        isLoading={isLoading}
        columns={tableColumns}
        rows={tableRows}
        editFunction={handleEditPerson}
        // deleteFunction={handleDeletePerson}
      />
      {deletingPerson && (
        <CustomDialog
          title="Excluir pessoa"
          text={`Confirma a exclusão da pessoa ${deletingPerson.nome}? Caso possua vínculos no sistema, ela será apenas inativada.`}
          isOpen={Boolean(deletingPerson)}
          onClose={handleCloseDialog}
          onConfirm={confirmDeleteProduct}
        />
      )}
    </Box>
  );
}

export default ProductList;
