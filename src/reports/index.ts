import get from './consultas';
import { NomeRelatorio } from "./nomesRelatorios";

export type Report = {
  name: NomeRelatorio,
  getData: () => Promise<any[]>,
}

const listaRelatorios: Report[] = [
  {
    name: NomeRelatorio.listaUsuarios,
    getData: get.listaUsuarios,
  },
  {
    name: NomeRelatorio.listaClientes,
    getData: get.listaClientes,
  }
];

export default listaRelatorios;