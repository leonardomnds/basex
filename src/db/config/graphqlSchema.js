import { gql } from 'apollo-server-micro';

export default gql`
  type Usuario {
    id: String!
    ativo: Boolean!
    nome: String!
    email: String
    usuario: String!
  }
  type Auth {
    token: String!
    usuario: Usuario
  }
  type Estado {
    uf: ID!
    descricao: String!
  }
  type Cidade {
    id: ID!
    descricao: String!
    uf: String!
  }
  type InfoEmpresa {
    fantasia: String
    logoBase64: String
  }

  type Query {
    estados: [Estado!]!
    cidades(uf: String!): [Cidade!]!

    infoEmpresa(identificadorEmpresa: String!): InfoEmpresa
  }

  type Mutation {
    login(
      identificadorEmpresa: String!,
      usuario: String!,
      senha: String!
    ): Auth

    criarUsuario(
      usuario: String!,
      senha: String!,
      nome: String!,
      email: String
    ) : Usuario
  }
`