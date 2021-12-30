import React from "react";
import { Page, Document, View, Text } from "@react-pdf/renderer";

import {
  getHeader,
  getRows,
  getColumns,
  getTable,
  columnData,
  getFooter,
} from "./padroes";
import { FormatUtcDate, PascalCase } from "../../util/functions";
import { NextPage } from "next";
import format from "date-fns/format";

type Props = {
  dados: [];
};

const ListaInstrumentos: NextPage<Props> = (props: Props) => {
  const { dados } = props;

  const gerarTabela = (dadosFiltrados: []) => {
    // Colunas da tabela
    const colunas: columnData = [
      { percLargura: 15, label: "Data", align: "center" },
      { percLargura: 30, label: "Certificado", align: "left" },
      { percLargura: 55, label: "Laboratório", align: "left" },
    ];

    // Linhas da tabela
    let linhas = [];
    let celulas = [];

    dadosFiltrados.map((i: any) => {
      celulas = [];
      celulas.push({
        label: i.data_calibracao ? FormatUtcDate(i.data_calibracao) : "",
      });
      celulas.push({ label: i.numero_certificado ?? "" });
      celulas.push({ label: PascalCase(i.laboratorio ?? "", 2) });

      linhas.push({ celula: celulas });
    });

    // Retornando a tabela montada
    return getTable(getColumns(colunas), getRows(linhas, colunas));
  };

  const getGruposInstrumentos = () => {
    const instrumentos: { tag: number; descricao: string }[] = [];
    dados.map((i: any) => {
      const instrumento = { tag: i.tag, descricao: i.descricao };
      if (
        instrumentos.filter(
          (ins: any) => ins.tag === i.tag && ins.descricao === i.descricao
        ).length === 0
      ) {
        instrumentos.push(instrumento);
      }
    });

    const gruposGerados = [];
    instrumentos.map((i: any) => {
      gruposGerados.push(
        <View>
          <View>
            <Text
              style={{
                fontSize: 12,
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                }}
              >
                Instrumento:
              </Text>
              {` ${i.tag} - ${i.descricao}`}
            </Text>
          </View>
          {gerarTabela(
            dados.filter(
              (v: any) => v.tag === i.tag && v.descricao === i.descricao
            ) as []
          )}
        </View>
      );
    });

    return <View style={{ marginTop: 5 }}>{gruposGerados.map((v) => v)}</View>;
  };

  return (
    <Document title="Lista de Calibrações">
      <Page size="A4" orientation="portrait" style={{ padding: "1cm" }}>
        {getHeader("Lista de Calibrações")}
        {getGruposInstrumentos()}
        {getFooter()}
      </Page>
    </Document>
  );
};

export default ListaInstrumentos;
