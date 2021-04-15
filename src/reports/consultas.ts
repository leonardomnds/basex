import prisma from "../prisma/PrismaInstance";

export default {
  async listaUsuarios(where: string) {
    const json = await prisma.$queryRaw(`
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
    const json = await prisma.$queryRaw(`
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
    console.error(where);
    const json = await prisma.$queryRaw(`
    select
      p.codigo as codigo_cliente,
      p.nome as nome_cliente,
      i.tag,
      i.descricao,
      i.area,
      i.ativo,
      MAX(c.data_calibracao) as ultima_calibracao,
      date_add(max(c.data_calibracao), interval i.tempo_calibracao month) as proxima_calibracao,
      datediff(date_add(max(c.data_calibracao), interval i.tempo_calibracao month), current_date) as dias_vencer
    from 
      instrumentos as i
      inner join pessoas as p on (i.pessoa_id = p.id)
      left join instrumentos_calibracoes as c on (i.id = c.instrumento_id)
    where ${where}
    group by
      p.codigo,
      p.nome,
      i.tag,
      i.descricao,
      i.area,
      i.ativo,
      i.tempo_calibracao
    order by
      p.codigo,
      i.descricao
    `);
    return json;
  },

};

