import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sql = await prisma.$queryRaw('SELECT current_database() as database, current_timestamp as datetime');

    if (sql && sql[0].database && sql[0].datetime) {
      res.status(200).json({
        database: sql[0].database,
        datetime: sql[0].datetime
      });
      return;
    }

    throw new Error('Ocorreu um erro na conexão com o banco de dados!');
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}