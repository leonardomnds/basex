import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../../prisma/PrismaInstance";
import cors from "../../../../../util/Cors";

export default async function Grupo(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const uf = req.query.uf.toString();

    if (req.method === "GET") {
      const cidades: any[] = await prisma.$queryRawUnsafe(`
      select
        cidade
      from (
        select distinct
        case when nullif(trim(cidade),'') is null then 0 else 1 end as ordem,
          case when nullif(trim(cidade),'') is null then 'Não informado' else upper(trim(cidade)) end as cidade
        from
          pessoas
        where
          uf = '${uf.toUpperCase().trim()}'
      ) as t
      order by
        t.ordem, t.cidade
      `);

      res.status(200).json(cidades);
    } else {
      res.status(405).json({ error: "Método não suportado!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
