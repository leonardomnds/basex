import prisma from "../prisma/PrismaInstance";

export default {
  async listaUsuarios() {
    const json = await prisma.$queryRaw(`
    select
      u.usuario,
      u.nome,
      to_char(u."dataCadastro", 'DD/MM/YYYY') as "dataCadastro",
      case when u.ativo = true then 'Sim' else 'Não' end as ativo
    from
      "Usuarios" u
    where
      u.usuario <> 'admin'
    `);
    return json;
  },
  async listaClientes() {
    const json = await prisma.$queryRaw(`
    select
      p.codigo,
      p."cpfCnpj",
      p.nome,
      p.fantasia,
      to_char(p."dataCadastro", 'DD/MM/YYYY') as "dataCadastro",
      case when p.ativo = true then 'Sim' else 'Não' end as ativo
    from
      "Pessoas" p
    order by
      p.nome
    `);
    return json;
  }

};

