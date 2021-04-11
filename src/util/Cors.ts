import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';

const cors = async (req: NextApiRequest, res: NextApiResponse) => {
   await NextCors(req, res, {
      // Options
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });
}

export default cors;