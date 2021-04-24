import { Calibracao } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import prisma from "../../../../../../../prisma/PrismaInstance";

import cors from '../../../../../../../util/Cors';
import { ValidateAuth } from '../../../../../../../util/functions';
import { multerUpload } from '../../../../../../../util/middlewares';
import fs from 'fs';

const Calibracoes = nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await cors(req, res);

      const usuarioId = ValidateAuth(req, 'user');
      const pessoaIdAuth = ValidateAuth(req, 'person');
      const pessoaId = req.query.id.toString();
      const instrumentoId = req.query.instrumentoId.toString();

      if (!usuarioId && pessoaIdAuth !== pessoaId) {
        res.status(401).json({error: 'Acesso não autorizado!'});
        return;
      }

      const json = await listarCalibracoes(instrumentoId);
      res.status(200).json(json);
      return;

    } catch (err) {
      res.status(500).json({error: err.message});
    }
  })
  .use(multerUpload.single('pdfCertificado'))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await cors(req, res);

      const usuarioId = ValidateAuth(req, 'user');
      const pessoaIdAuth = ValidateAuth(req, 'person');
      const pessoaId = req.query.id.toString();
      const instrumentoId = req.query.instrumentoId.toString();

      if (!usuarioId && pessoaIdAuth !== pessoaId) {
        res.status(401).json({error: 'Acesso não autorizado!'});
        return;
      }

      const calibracaoSalvar : Calibracao = req.body;
      const retPost = await salvarCalibracao(calibracaoSalvar, instrumentoId);

      if (req['file'] && req['file']?.path && retPost?.calibracao?.id) {
        fs.readFile(req['file'].path, async (fsErr, data) => {
          if (!fsErr) await salvarPdfCertificadoCalibracao(retPost.calibracao.id, data);
          fs.unlink(req['file'].path, () => {});
        });
      }

      res.status(201).json(retPost.calibracao);
      return;
    } catch (err) {
      res.status(500).json({error: err.message});
    }
  })
  .all((req: NextApiRequest, res: NextApiResponse) => {
    if (req['file'] && req['file'].path) {        
      fs.unlink(req['file'].path, () => {});
    }
    res.status(405).json({error: 'Método não suportado!'});
  })

export default Calibracoes;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

/*
export default async function Calibracoes(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const usuarioId = ValidateAuth(req, 'user');
    const pessoaIdAuth = ValidateAuth(req, 'person');
    const pessoaId = req.query.id.toString();
    const instrumentoId = req.query.instrumentoId.toString();

    if (!usuarioId && pessoaIdAuth !== pessoaId) {
      res.status(401).json({error: 'Acesso não autorizado!'});
      return;
    }

    switch (req.method) {
      case 'POST':
        const calibracaoSalvar : Calibracao = req.body;
        const retPost = await salvarCalibracao(calibracaoSalvar, instrumentoId);

        res.status(201).json(retPost.calibracao);
        return;

      case 'GET':
        const json = await listarCalibracoes(instrumentoId);
        res.status(200).json(json);
        return;

      default:
        res.status(405).json({error: 'Método não suportado!'});
        return;
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}
*/
const listarCalibracoes = async (instrumento_id: string) => {

  const calibracoes = await prisma.calibracao.findMany({
    where: {
      instrumento_id
    },
    orderBy: {
      data_calibracao: 'asc',
    },
    select: getCalibracaoJsonReturn(),
  });

  return calibracoes;
}

export const salvarCalibracao = async (calibracao: Calibracao, instrumentoId: string) => {

  const id = calibracao.id;
  delete calibracao.id;

  calibracao.instrumento_id = instrumentoId;
  calibracao.pdfCertificado = null; // Necessário chamar o método 'salvarPdfCertificadoCalibracao'

  if (typeof calibracao.data_calibracao === 'string') {
    calibracao.data_calibracao = new Date(calibracao.data_calibracao);
  }

  let json;
  if (id) { // Update
    delete calibracao.data_cadastro;

    json = await prisma.calibracao.update({
      data: calibracao,
      where: {
        id: id
      },
      select: getCalibracaoJsonReturn(),
    });
  } else {
    calibracao.data_cadastro = new Date();

    json = await prisma.calibracao.create({
      data: calibracao,
      select: getCalibracaoJsonReturn(),
    });
  }

  return { calibracao: json };

}

export const salvarPdfCertificadoCalibracao = async (calibracaoId: string, pdf: Buffer) => {
  await prisma.calibracao.update({
    data: {
      pdfCertificado: pdf
    },
    where: {
      id: calibracaoId
    }
  });
}

export const getCalibracaoJsonReturn = () => {
  return {
    id: true,
    instrumento: {
      select: {
        id: true,
        tag: true,
        descricao: true,
      }
    },
    data_calibracao: true,
    numero_certificado: true,
    laboratorio: true,
  }
}