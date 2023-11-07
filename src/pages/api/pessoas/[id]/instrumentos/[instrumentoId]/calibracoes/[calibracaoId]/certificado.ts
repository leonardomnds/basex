import { NextApiRequest, NextApiResponse } from "next";
import cors from "../../../../../../../../util/Cors";
import prisma from '../../../../../../../../prisma/PrismaInstance';
import fs from 'fs';

export default async function Certificado(req: NextApiRequest, res: NextApiResponse) {

  const id = req.query.calibracaoId.toString();
  const filePath = `/tmp/Certificado-${id}.pdf`;

  try {

    await cors(req, res);

    if (req.method === 'GET') {

      const calibracao = await prisma.calibracao.findUnique({
        select: {
          pdfCertificado: true,
          pdfCertificadoBase64: true,
        },
        where: {
          id
        }
      })

      const renderError = () => res.status(403).json({ error: 'Calibração não possui certificado anexado!'});

      if (calibracao) {
        let { pdfCertificado, pdfCertificadoBase64 } = calibracao;

        if (pdfCertificadoBase64) {
          pdfCertificado = Buffer.from(pdfCertificadoBase64.split(",")[1], 'base64');
        }

        if (pdfCertificado) {
          fs.writeFile(filePath, pdfCertificado, async (writeErr) => {
            if (writeErr) throw new Error(writeErr.message);
            fs.readFile(filePath, async (readErr, file) => {
              if (readErr) throw new Error(readErr.message);
              fs.unlink(filePath, () => {})
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-disposition', `attachment; filename=${id}.pdf`);
              res.status(200).send(file);
              return;
            });
          });
        } else {
          renderError();
          return;
        }
      } else {
        renderError();
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