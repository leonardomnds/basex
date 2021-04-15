import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import cors from '../../../util/Cors';
import ListaViews from '../../../util/CreateViews';

export default async function CriarViews(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const execPromise = ListaViews.map(async (sql) => {
      await prisma.$executeRaw(sql);
    });

    await Promise.all(execPromise);

    res.status(200).json({ message: 'Views criadas/alteradas com sucesso!', datetime: new Date() });
    return;

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}