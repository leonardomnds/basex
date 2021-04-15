import { NextApiRequest, NextApiResponse } from "next";
import pdf, { CreateOptions } from "html-pdf";
import ejs from "ejs";

import { format } from 'date-fns';

import cors from "../../../util/Cors";
import listaRelatorios from "../../../reports";
import { NomeRelatorio } from '../../../reports/nomesRelatorios';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (req.method === "GET") {

      const objRelatorio =
        listaRelatorios.filter(
          (v) => v.name === NomeRelatorio.listaUsuarios // ALterar para filtrar da req
        )?.[0] || null;

      if (objRelatorio) {

        const data = await objRelatorio.getData('1=1');

        ejs.renderFile(`./src/reports/${objRelatorio.name}.ejs`, { data }, (err, html) => {
          if (err) {
            throw new Error(err.message);
          } else {

            const options : CreateOptions = {
              type: 'pdf',
              format: 'A4',
              orientation: 'portrait',
              border: "2cm",
            };

            pdf.create(html, options).toBuffer((pdfErr, pdfBuffer) => {
              if (pdfErr) {
                throw new Error(pdfErr.message);
              } else {                
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-disposition', 'attachment; filename=Relatorio-'+format(new Date(), 'yyyy-MM-dd-HH-mm-ss')+'.pdf');
                res.status(200).send(pdfBuffer);
              }
            });

          }
        });

      } else {
        res.status(400).json({ error: "O relatório solicitado não existe!" });
        return;
      }

    } else {
      res.status(405).json({ error: "Método não suportado!" });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}