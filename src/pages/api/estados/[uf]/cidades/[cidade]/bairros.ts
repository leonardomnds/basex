import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../../../prisma/PrismaInstance";
import cors from "../../../../../../util/Cors";

export default async function Grupo(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const uf = req.query.uf.toString();
    const cidade = req.query.cidade.toString();

    if (req.method === "GET") {
      const bairros = await prisma.$queryRaw(`
      select
        bairro
      from (
        select distinct
          case when nullif(trim(bairro),'') is null then 0 else 1 end as ordem,
          case when nullif(trim(bairro),'') is null then 'Não informado' else upper(trim(bairro)) end as bairro
        from
          pessoas
        where
          uf = '${uf.toUpperCase().trim()}'
          and upper(trim(cidade)) = '${cidade.toUpperCase().trim()}'
      ) as t
      order by
        t.ordem, t.bairro
      `);

      res.status(200).json(bairros);
    } else {
      res.status(405).json({ error: "Método não suportado!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
