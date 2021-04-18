import { NextApiRequest, NextApiResponse } from "next";
import cors from "../../../../../../../../util/Cors";
import prisma from '../../../../../../../../prisma/PrismaInstance';
import fs from 'fs';

export default async function Certificado(req: NextApiRequest, res: NextApiResponse) {

  const id = req.query.calibracaoId.toString();
  const filePath = `./public/arquivos/Certificado-${id}.pdf`;

  try {

    await cors(req, res);

    if (req.method === 'GET') {

      const calibracao = await prisma.calibracao.findUnique({
        select: {
          pdfCertificado: true,
        },
        where: {
          id
        }
      })

      if (calibracao && calibracao?.pdfCertificado) {
        fs.writeFile(filePath, calibracao.pdfCertificado, async (writeErr) => {
          if (writeErr) throw new Error(writeErr.message);
          fs.readFile(filePath, async (readErr, file) => {
            if (readErr) throw new Error(readErr.message);
            fs.unlink(filePath, () => {})
            res.setHeader('Content-disposition', 'attachment; filename='+filePath.slice(filePath.lastIndexOf('/')+1));
            res.setHeader('Content-Type', 'application/pdf');
            res.status(200).send(file);
            return;
          });
        });
      } else {
        res.status(403).json({ error: 'Calibração não possui certificado anexado!'});
        return;
      }

    } else {
      res.status(405).json({error: 'Método não suportado!'});
      return;
    }
  } catch (err) {
    fs.unlink(filePath, () => {});
    res.status(500).json({error: err.message});
  }
}