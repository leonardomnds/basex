import prisma from "../prisma/PrismaInstance";
import ConsultasComuns from "../util/ConsultasComuns";

export default {
  async listaUsuarios(where: string) {
    const json = await prisma.$queryRawUnsafe(`
    select
      u.usuario,
      u.nome,
      u.data_cadastro,
      u.ativo
    from
      usuarios u
    where
      u.usuario <> 'admin'
      and ${where}
    `);
    return json;
  },
  async listaClientes(where: string) {
    const json = await prisma.$queryRawUnsafe(`
    select
      p.codigo,
      p.cpf_cnpj,
      p.nome,
      p.fantasia,
      p.data_cadastro,
      p.ativo
    from
      pessoas p
    where ${where}
    order by
      p.nome
    `);
    return json;
  },
  async listaInstrumentos(where: string) {
    const json = await prisma.$queryRawUnsafe(`    
    select
      p.codigo as codigo_cliente,
      p.nome as nome_cliente,
      i.tag,
      i.descricao,
      i.area,
      i.ativo,
      v.ultima_calibracao,
      v.vencimento_calibracao,
      v.dias_vencer
    from 
      instrumentos as i
      inner join pessoas as p on (i.pessoa_id = p.id)
      inner join (${ConsultasComuns.vencimentosCalibracoes()}) as v on (i.id = v.id)
    where ${where}
    order by
      p.codigo,
      i.descricao
    `);
    return json;
  },
  async listaCalibracoes(where: string) {
    const json = await prisma.$queryRawUnsafe(`
    select
      i.tag,
      i.descricao,
      c.data_calibracao,
      c.numero_certificado,
      c.laboratorio
    from 
      instrumentos_calibracoes as c
      inner join instrumentos as i on (i.id = c.instrumento_id)
    where ${where}
    order by
      i.descricao,
      c.data_calibracao
    `);
    return json;
  },
};
