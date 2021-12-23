import { Calibracao } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import prisma from "../../../../../../../../prisma/PrismaInstance";

import cors from "../../../../../../../../util/Cors";
import { ValidateAuth } from "../../../../../../../../util/functions";
import { multerUpload } from "../../../../../../../../util/middlewares";
import fs from "fs";
import { salvarCalibracao, salvarPdfCertificadoCalibracao } from "..";

const Calibration = nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await cors(req, res);

      const usuarioId = ValidateAuth(req, "user");
      const pessoaIdAuth = ValidateAuth(req, "person");
      const pessoaId = req.query.id.toString();
      // const instrumentoId = req.query.instrumentoId.toString();
      const calibracaoId = req.query.calibracaoId.toString();

      if (!usuarioId && pessoaIdAuth !== pessoaId) {
        res.status(401).json({ error: "Acesso não autorizado!" });
        return;
      }

      const json = await consultarCalibracao(calibracaoId);
      res.status(200).json(json);
      return;
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await cors(req, res);

      const usuarioId = ValidateAuth(req, "user");
      const pessoaIdAuth = ValidateAuth(req, "person");
      const pessoaId = req.query.id.toString();
      // const instrumentoId = req.query.instrumentoId.toString();
      const calibracaoId = req.query.calibracaoId.toString();

      if (!usuarioId && pessoaIdAuth !== pessoaId) {
        res.status(401).json({ error: "Acesso não autorizado!" });
        return;
      }

      const json = await deletarCalibracao(calibracaoId);
      res.status(202).json(json);
      return;
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .use(multerUpload.single("pdfCertificado"))
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await cors(req, res);

      const usuarioId = ValidateAuth(req, "user");
      const pessoaIdAuth = ValidateAuth(req, "person");
      const pessoaId = req.query.id.toString();
      const instrumentoId = req.query.instrumentoId.toString();
      const calibracaoId = req.query.calibracaoId.toString();

      if (!usuarioId && pessoaIdAuth !== pessoaId) {
        res.status(401).json({ error: "Acesso não autorizado!" });
        return;
      }

      const calibracaoSalvar: Calibracao = req.body;
      calibracaoSalvar.id = calibracaoId;

      const retPut = await salvarCalibracao(calibracaoSalvar, instrumentoId);

      if (req["file"] && req["file"]?.path && calibracaoId) {
        fs.readFile(req["file"].path, async (fsErr, data) => {
          if (!fsErr) await salvarPdfCertificadoCalibracao(calibracaoId, data);
          fs.unlink(req["file"].path, () => {});
        });
      }

      res.status(200).json(retPut.calibracao);
      return;
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .all((req: NextApiRequest, res: NextApiResponse) => {
    if (req["file"] && req["file"].path) {
      fs.unlink(req["file"].path, () => {});
    }
    res.status(405).json({ error: "Método não suportado!" });
  });

export default Calibration;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const consultarCalibracao = async (id: string) => {
  const calibracao = await prisma.calibracao.findUnique({
    where: {
      id,
    },
    select: getCalibracaoJsonReturn(),
  });

  return calibracao;
};

const deletarCalibracao = async (id: string) => {
  const calibracao = await prisma.calibracao.delete({
    where: {
      id,
    },
  });

  return calibracao;
};

const getCalibracaoJsonReturn = () => {
  return {
    id: true,
    instrumento: {
      select: {
        id: true,
        tag: true,
        descricao: true,
        pessoa: {
          select: {
            id: true,
            codigo: true,
            cpf_cnpj: true,
            nome: true,
            fantasia: true,
          },
        },
      },
    },
    data_calibracao: true,
    numero_certificado: true,
    laboratorio: true,
  };
};
