import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

import { ApolloError, AuthenticationError } from "apollo-server-micro";

import validateAuth from '../../db/config/validateAuth';

import Usuario from '../models/Usuario';
import Empresa from '../models/Empresa';

const attributes = [
  'id',
  'ativo',
  'nome',
  'email',
  'usuario',
];

module.exports = {
  async login(_, { identificadorEmpresa, usuario, senha }) {

    const emp = await Empresa.findOne({
      attributes: ['id'],
      where: { identificador: identificadorEmpresa}
    });

    if (!emp) throw new AuthenticationError("Identificador da empresa não encontrado");

    const attributes2 = attributes;
    attributes2.push('senha');

    const user = await Usuario.findOne({
      attributes: attributes2,
      where: {
        usuario,
        empresaId: emp.dataValues.id,
        ativo: true,
      }
    });

    if (user) {
      const validPass = bcrypt.compareSync(senha, user.dataValues.senha);

      if (validPass) {
        const token = await jwt.sign(
          {
            usuarioId: user.dataValues.id,
            empresaId: emp.dataValues.id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: 86400, // 24 horas
          }
        );

        return {
          token,
          usuario: user
        };
      }
    }

    throw new AuthenticationError("Usuário e/ou senha inválido");     
  },
  async insert(_, { usuario, senha, nome, email }, { user }) {

    validateAuth(user);

    const { empresaId } = user;
    
    if (
      await Usuario.findOne({
        where: {
          usuario,
          empresaId,
        },
      })
    ) {
      throw new ApolloError("Usuário já existe", "user already exists");
    }

    let json = await Usuario.create({
      usuario,
      senha: bcrypt.hashSync(senha, 10),
      nome,
      email,
      empresaId,
      ativo: true,
    });

    json = await Usuario.findByPk(json.dataValues.id, {
      attributes
    });

    return json;
  }
}