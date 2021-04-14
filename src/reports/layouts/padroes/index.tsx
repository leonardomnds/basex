import { StyleSheet, View, Text, Font } from "@react-pdf/renderer";
import { format } from "date-fns";

const classes = StyleSheet.create({
  reportHeader: {
    marginBottom: '5px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid black',
    padding: '10px 20px',
  },
  reportTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
  },
  reportDateTime: {
    fontSize: 10,
  },
  headerRigth: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: '1cm',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

export const getHeader = (title: string) => {
  return (
    <View fixed style={classes.reportHeader}>
      <Text style={classes.reportTitle}>{title}</Text>
      <View style={classes.headerRigth}>
        <Text style={classes.reportDateTime}>Data/Hora</Text>
        <Text style={classes.reportDateTime}>{format(new Date(), 'dd/MM/yyyy HH:mm')}</Text>
      </View>      
    </View>
  );
}

export const getFooter = () => {
  return (
    <Text style={classes.pageNumber} render={({ pageNumber, totalPages }) => (
      `${pageNumber} / ${totalPages}`
    )} fixed />
  );
}

export const getTable = (colunas: JSX.Element, linhas: JSX.Element[]) => {
  return (
    <View style={{ width: 'auto', margin: '0cm' }}>
      {colunas}
      {linhas.map((value) => value)}
    </View>
  );
}

export type columnData = {
  percLargura: number,
  label: string,
  align?: 'left' | 'right' | 'center'
}[]

export type rowData = {
  celula: {
    label: string
  }[]
}[]

export const getColumns = (
  colunas: columnData,
  fixed?: boolean
) => {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 2 }} fixed={fixed}>
      {colunas.map((i, key) => {
          return (
            <View style={{
              width: `${i.percLargura.toString()}%`,
              border: '1px solid black',
              fontFamily: 'Helvetica-Bold',
              borderRight: key!==colunas.length-1 ? 0 : '1px solid black',
            }}>
              <Text style={{
                textAlign: i.align || 'left',
                margin: '4px',
                fontSize: 12,
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'row',
              }}>
                {i.label}
              </Text>
            </View>
          );
        })}    
    </View>
  );
};

export const getRows = (
  linhas: rowData,
  colunas: columnData,
) => {

  const jsxLinhas = []

  linhas.map((linha, rowIndex) => {
    jsxLinhas.push(
      <View style={{
        flexDirection: 'row',
        backgroundColor: rowIndex % 2 === 0 ? '#FFF' : '#EEE'
      }}>
        {linha.celula.map((cell, cellIndex) => {
            return (
              <View style={{
                width: `${colunas[cellIndex].percLargura}%`,
              }}>
                <Text style={{
                  margin: '1.5px 4px',
                  fontSize: 12,
                  textAlign: colunas[cellIndex].align || 'left',                  
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                  {cell.label}
                </Text>
              </View>
            );
          })}
      </View>
    );
  });

  return jsxLinhas;
}