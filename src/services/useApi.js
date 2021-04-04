import api from '../util/Api';

const getResponseData = (response) => {
  try {
    const retorno = { data: null, error: null, extensions: null };

    if (response.data && response.status !== 500) {
      if (response.data.errors) {
        retorno.error = response.data.errors;
      }
      if (response.data.error && response.data.error.errors) {
        retorno.error = response.data.error.errors;
      }
      if (response.data.extensions) {
        retorno.extensions = response.data.extensions;
      }
      if (retorno.error) {
        retorno.error = retorno.error[0].detalhes;
      }
      if (response.data.data) {
        retorno.data = response.data.data;
        retorno.error = null;
      }
    } else {
      retorno.error = 'Não foi possível se comunicar com o Servidor!';
    }

    return retorno;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  async login(authEmpresa, usuario, senha) {
    return getResponseData(
      await api.post('', {
        query: `
        mutation ($authEmpresa: String!, $usuario: String!, $senha: String!) {
          login(
            identificadorEmpresa: $authEmpresa,
            usuario: $usuario,
            senha: $senha
          ) {
            token,
            usuario {
              id,
              nome,
              usuario,
              email
            }
          }
        }`,
        variables: { authEmpresa, usuario, senha },
      }),
    );
  },
  async findEmpresaById(authEmpresa) {
    return getResponseData(
      await api.post('', {
        query: `
        query ($authEmpresa: String!) {
          infoEmpresa(
            identificadorEmpresa: $authEmpresa,
          ) {
            fantasia,
            logoBase64
          }
        }`,
        variables: { authEmpresa },
      }),
    );
  },
  async getListaPessoas() {
    return getResponseData(
      await api.post('', {
        query: `
      query {
        pessoas {
          id
          codigo
          cpfCnpj
          nome
          fantasia
          logradouro
          numeroLogradouro
          ativo
        }
      }`,
      }),
    );
  },
  async getListaEstados() {
    return getResponseData(
      await api.post('', {
        query: `
      query {
        estados {
          uf
          descricao
        }
      }`,
      }),
    );
  },
  async getGruposPessoas() {
    return getResponseData(
      await api.post('', {
        query: `
      query {
        gruposPessoa {
          id
          descricao
        }
      }`,
      }),
    );
  },
  async getCategoriasPessoas() {
    return getResponseData(
      await api.post('', {
        query: `
      query {
        categoriasPessoa {
          id
          descricao
        }
      }`,
      }),
    );
  },
  async consultarCEP(cep) {
    return getResponseData(
      await api.post('', {
        query: `
      query ($cep: String!) {
        consultarCep(cep: $cep) {
          cep
          logradouro
          bairro
          complemento
          cidade
          uf
        }
      }`,
        variables: { cep },
      }),
    );
  },
  async consultarCNPJ(cnpj) {
    return getResponseData(
      await api.post('', {
        query: `
      query ($cnpj: String!) {
        consultarCnpj(cnpj: $cnpj) {
          cnpj
          razaoSocial
          fantasia
          endereco {
            cep
            logradouro
            bairro
            complemento
            cidade
            uf
          }
        }
      }`,
        variables: { cnpj },
      }),
    );
  },
  async getPessoa(id) {
    return getResponseData(
      await api.post('', {
        query: `
      query ($id: UUID!) {
        pessoa (
          id: $id
        ) {
          id
          codigo
          cpfCnpj
          nome
          fantasia
          rgInscEstadual
          inscMunicipal
          telefone
          celular
          email
          cep
          logradouro
          numeroLogradouro
          bairro
          complementoLogradouro
          cidade
          uf
          ativo
          contatos {
            id
            nome
            descricao
            telefone
            celular
            email
          }
        }
      }`,
        variables: { id },
      }),
    );
  },
  async salvarPessoa(
    id,
    cpfCnpj,
    nome,
    fantasia,
    rgInscEstadual,
    inscMunicipal,
    telefone,
    celular,
    email,
    cep,
    logradouro,
    numeroLogradouro,
    bairro,
    complementoLogradouro,
    cidade,
    uf,
    grupoId,
    categoriaId,
    ativo,
    contatos,
  ) {
    return getResponseData(
      await api.post('', {
        query: `
      mutation (
        $id: UUID
        $cpfCnpj: String!
        $nome: String!
        $fantasia: String
        $rgInscEstadual: String
        $inscMunicipal: String
        $telefone: String
        $celular: String
        $email: String
        $cep: String
        $logradouro: String
        $numeroLogradouro: String
        $bairro: String
        $complementoLogradouro: String
        $cidade: String
        $uf: String
        $grupoId: UUID
        $categoriaId: UUID
        $ativo: Boolean
        $contatos: [ContatoPessoaInput!]
      ) {
        salvarPessoa (
          id: $id,
          cpfCnpj: $cpfCnpj,
          nome: $nome,
          fantasia: $fantasia,
          rgInscEstadual: $rgInscEstadual,
          inscMunicipal: $inscMunicipal,
          telefone: $telefone,
          celular: $celular,
          email: $email,
          cep: $cep,
          logradouro: $logradouro,
          numeroLogradouro: $numeroLogradouro,
          bairro: $bairro,
          complementoLogradouro: $complementoLogradouro,
          cidade: $cidade,
          uf: $uf,
          grupoId: $grupoId,
          categoriaId: $categoriaId,
          ativo: $ativo,
          contatos: $contatos
        ) {
          id
        }
      }`,
        variables: {
          id,
          cpfCnpj,
          nome,
          fantasia,
          rgInscEstadual,
          inscMunicipal,
          telefone,
          celular,
          email,
          cep,
          logradouro,
          numeroLogradouro,
          bairro,
          complementoLogradouro,
          cidade,
          uf,
          grupoId,
          categoriaId,
          ativo,
          contatos,
        },
      }),
    );
  },
};
