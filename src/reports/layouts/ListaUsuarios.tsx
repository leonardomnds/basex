import React from 'react'
import { Page, Document } from '@react-pdf/renderer';

import { getHeader, getRows, getColumns, getTable, columnData, getFooter } from './padroes';
import { NextPage } from 'next';
import { PascalCase } from '../../util/functions';
import format from 'date-fns/format';

type Props = {
  dados: []
}

const ListaUsuarios : NextPage<Props> = (props: Props) => {

  const { dados } = props;

  const gerarTabela = () => {

    // Colunas da tabela
    const colunas: columnData = [
      { percLargura: 30, label: "Usuário" },
      { percLargura: 40, label: "Nome" },
      { percLargura: 15, label: "Ativo", align: 'center' },
      { percLargura: 15, label: "Cadastro", align: 'center' }
    ];

    // Linhas da tabela
    let linhas = [];
    let celulas = [];

    dados.map((u: any) => {
      celulas = [];
      celulas.push({ label: u.usuario });
      celulas.push({ label: PascalCase(u.nome, 2) });
      celulas.push({ label: u.ativo ? 'Sim' : 'Não' });
      celulas.push({ label: u.data_cadastro ? format(new Date(u.data_cadastro), 'dd/MM/yyyy') : '' });

      linhas.push({ celula: celulas });
    });

    // Retornando a tabela montada
    return getTable(getColumns(colunas), getRows(linhas, colunas));

  }

  return (
    <Document title="Lista de Usuários">
      <Page size="A4" orientation="portrait" style={{ padding: '1cm' }}>
        {getHeader("Lista de Usuários")}
        {gerarTabela()}
        {getFooter()}
      </Page>
    </Document>
  )
}

export default ListaUsuarios
