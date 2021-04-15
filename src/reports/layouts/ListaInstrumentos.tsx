import React from 'react'
import { Page, Document, View, Text } from '@react-pdf/renderer';

import { getHeader, getRows, getColumns, getTable, columnData, getFooter } from './padroes';
import { PascalCase, ZerosLeft } from '../../util/functions';
import { NextPage } from 'next';
import format from 'date-fns/format';

type Props = {
  dados: []
}

const ListaInstrumentos: NextPage<Props> = (props: Props) => {

  const { dados } = props;

  const gerarTabela = (dadosFiltrados: []) => {

    // Colunas da tabela
    const colunas: columnData = [
      { percLargura: 18, label: "Tag", align: 'center' },
      { percLargura: 34, label: "Descrição", align: 'left' },
      { percLargura: 18, label: "Área" },
      { percLargura: 12, label: "Últ. Calibração", align: 'center' },
      { percLargura: 12, label: "Vencimento", align: 'center' },
      { percLargura: 6, label: "Ativo", align: 'center' },
    ];

    // Linhas da tabela
    let linhas = [];
    let celulas = [];

    dadosFiltrados.map((i: any) => {
      celulas = [];
      celulas.push({ label: i.tag || '' });
      celulas.push({ label: i.descricao || '' });
      celulas.push({ label: i.area ? PascalCase(i.area, 2) : '' });
      celulas.push({ label: i.ultima_calibracao ? format(new Date(i.ultima_calibracao), 'dd/MM/yyyy') : '' });
      celulas.push({ label: i.proxima_calibracao ? format(new Date(i.proxima_calibracao), 'dd/MM/yyyy') : '' });
      celulas.push({ label: i.ativo ? 'Sim' : 'Não' });

      linhas.push({ celula: celulas });
    });

    // Retornando a tabela montada
    return getTable(getColumns(colunas), getRows(linhas, colunas));
  }

  const getGruposClientes = () => {

    const clientes: { codigo: number, nome: string }[] = [];
    dados.map((c: any) => {
      const cliente = { codigo: c.codigo_cliente, nome: c.nome_cliente };
      if (clientes.filter((cli: any) => cli.codigo === c.codigo_cliente).length === 0) {
        clientes.push(cliente);
      }
    });

    const gruposGerados = [];
    clientes.map((c: any) => {
      gruposGerados.push(
        <View>
          <View>
            <Text style={{
              fontSize: 12,
              marginBottom: 5,
            }}>
              <Text style={{
                fontFamily: 'Helvetica-Bold',
              }}>
                Cliente:
              </Text>
              {` ${ZerosLeft(c.codigo, 4)} - ${PascalCase(c.nome, 3)}`}
            </Text>
          </View>
          {gerarTabela(dados.filter((v: any) => v.codigo_cliente === c.codigo) as [])}
        </View>
      );      
    });

    return <View style={{ marginTop: 5 }}>{gruposGerados.map((v) => v)}</View>
  }

  return (
    <Document title="Lista de Clientes">
      <Page size="A4" orientation="landscape" style={{ padding: '1cm' }}>
        {getHeader("Lista de Instrumentos")}
        {/* {gerarTabela()} */}
        {getGruposClientes()}
        {getFooter()}
      </Page>
    </Document>
  )
}

export default ListaInstrumentos
