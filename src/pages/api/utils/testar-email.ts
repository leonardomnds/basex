import { Configuracao } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from "nodemailer";

import cors from '../../../util/Cors';
import { ValidateAuth } from '../../../util/functions';
import { getNodeMailerTransporter } from '../login/recuperar';

export default async function RedefinirSenha(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const usuarioId = ValidateAuth(req, 'adm');

    if (!usuarioId) {
      res.status(401).json({error: 'Acesso não autorizado!'});
      return;
    }  

    if (req.method === 'POST') {

      const { email_smtp, email_porta, email_usuario, email_senha, email_ssl, email_tls } = req.body

      const transporter = nodemailer.createTransport({
        host: email_smtp,
        port: email_porta,
        secure: email_ssl,
        requireTLS: email_tls,
        auth: {
          user: email_usuario,
          pass: email_senha,
        },
      });

      await transporter.sendMail({
        from: `E-mail automático <${email_usuario}>`,
        to: email_usuario,
        subject: 'Teste de configurações',
        html: '<p>Se você recebeu essa mensagem, seu e-mail foi configurado corretamente no sistema!</p>',
      }, function( sendErr, info ) {
        if (sendErr) {
          res.status(400).json({ error: 'Erro ao testar o e-mail: ' + sendErr.message });
          return;
        }

        res.status(200).json({ message: 'E-mail enviado!' });
        return;
      }); 

    } else {
      res.status(405).json({error: 'Método não suportado!'});
      return;
    }     

  } catch (err) {
    res.status(500).json({error: err.message});
    return;
  }

}