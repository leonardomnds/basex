import { gql } from 'apollo-server-micro';

export default gql`
  scalar UUID
  scalar Date

  type Usuario {
    id: ID!
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
  type DadosCEP {
    cep: String!
    logradouro: String
    bairro: String
    complemento: String
    cidade: Cidade
  }
  type DadosCNPJ {
    cnpj: String
    razaoSocial: String
    fantasia: String
    endereco: DadosCEP
  }
  type InfoEmpresa {
    fantasia: String
    logoBase64: String
  }
  type CategoriaPessoa {
    id: ID!
    descricao: String!
  }
  type GrupoPessoa {
    id: ID!
    descricao: String!
  }
  type ContatoPessoa {
    id: ID!
    nome: String!
    descricao: String
    telefone: String
    celular: String
    email: String
    dataCadastro: Date!
  }
  type Pessoa {
    id: ID!
    codigo: Int!
    cpfCnpj: String!
    nome: String!
    fantasia: String
    rgInscEstadual: String
    inscMunicipal: String
    telefone: String
    celular: String
    email: String
    cep: String
    logradouro: String
    numeroLogradouro: String
    bairro: String
    complementoLogradouro: String
    ativo: Boolean!
    dataCadastro: Date!
    contatos: [ContatoPessoa!]
  }

  input ContatoPessoaInput {
    nome: String!
    descricao: String
    telefone: String
    celular: String
    email: String
  }

  type Query {
    estados: [Estado!]!
    cidades(uf: String!): [Cidade!]!
    consultarCep(cep: String!): DadosCEP
    consultarCnpj(cnpj: String!): DadosCNPJ
    infoEmpresa(identificadorEmpresa: String!): InfoEmpresa
    categoriasPessoa: [CategoriaPessoa!]!
    gruposPessoa: [GrupoPessoa!]!
    pessoa(id: UUID): Pessoa
    pessoas: [Pessoa!]!
  }

  type Mutation {
    login(identificadorEmpresa: String!, usuario: String!, senha: String!): Auth

    criarUsuario(
      usuario: String!
      senha: String!
      nome: String!
      email: String
    ): Usuario

    criarCategoriaPessoa(descricao: String!): CategoriaPessoa

    alterarCategoriaPessoa(id: UUID!, descricao: String!): CategoriaPessoa

    deletarCategoriaPessoa(id: UUID!): CategoriaPessoa

    criarGrupoPessoa(descricao: String!): GrupoPessoa

    alterarGrupoPessoa(id: UUID!, descricao: String!): GrupoPessoa

    deletarGrupoPessoa(id: UUID!): GrupoPessoa

    salvarPessoa(
      id: UUID
      cpfCnpj: String!
      nome: String!
      fantasia: String
      rgInscEstadual: String
      inscMunicipal: String
      telefone: String
      celular: String
      email: String
      cep: String
      logradouro: String
      numeroLogradouro: String
      bairro: String
      complementoLogradouro: String
      cidadeId: UUID
      grupoId: UUID
      categoriaId: UUID
      ativo: Boolean
      contatos: [ContatoPessoaInput!]
    ): Pessoa
  }
`;
