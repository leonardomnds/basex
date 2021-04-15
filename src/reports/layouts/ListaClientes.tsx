import React from 'react'
import { Page, Document } from '@react-pdf/renderer';

import { getHeader, getRows, getColumns, getTable, columnData, getFooter } from './padroes';
import { PascalCase, ZerosLeft } from '../../util/functions';
import { NextPage } from 'next';
import format from 'date-fns/format';

type Props = {
  dados: []
}

const ListaUsuarios: NextPage<Props> = (props: Props) => {

  const { dados } = props;

  const gerarTabela = () => {

    // Colunas da tabela
    const colunas: columnData = [
      { percLargura: 7, label: "Código", align: 'center' },
      { percLargura: 15, label: "CPF/CNPJ", align: 'center' },
      { percLargura: 34, label: "Nome" },
      { percLargura: 30, label: "Fantasia" },
      { percLargura: 5, label: "Ativo", align: 'center' },
      { percLargura: 9, label: "Cadastro", align: 'center' }
    ];

    // Linhas da tabela
    let linhas = [];
    let celulas = [];

    dados.map((p: any) => {
      celulas = [];
      celulas.push({ label: ZerosLeft(p.codigo, 4) });
      celulas.push({ label: p.cpf_cnpj });
      celulas.push({ label: PascalCase(p.nome, 2) });
      celulas.push({ label: PascalCase(p.fantasia, 2) });
      celulas.push({ label: p.ativo ? 'Sim' : 'Não' });
      celulas.push({ label: p.data_cadastro ? format(new Date(p.data_cadastro), 'dd/MM/yyyy') : ''});

      linhas.push({ celula: celulas });
    });

    // Retornando a tabela montada
    return getTable(getColumns(colunas), getRows(linhas, colunas));

  }

  return (
    <Document title="Lista de Clientes">
      <Page size="A4" orientation="landscape" style={{ padding: '1cm' }}>
        {getHeader("Lista de Clientes")}
        {gerarTabela()}
        {getFooter()}
      </Page>
    </Document>
  )
}

export default ListaUsuarios
