import get from './consultas';
import { NomeRelatorio } from "./nomesRelatorios";

export type Report = {
  name: NomeRelatorio,
  getData: (where: string) => Promise<any[]>,
}

const listaRelatorios: Report[] = [
  {
    name: NomeRelatorio.listaUsuarios,
    getData: get.listaUsuarios,
  },
  {
    name: NomeRelatorio.listaClientes,
    getData: get.listaClientes,
  },
  {
    name: NomeRelatorio.listaInstrumentos,
    getData: get.listaInstrumentos,
  }
];

export default listaRelatorios;