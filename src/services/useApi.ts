import api from '../util/Api';

interface LoginParameters {
  identificador: string | string[],
  usuario: string,
  senha: string
}

interface EntidadeWith2Fields {
  id: string,
  descricao: string
}

interface ContatosPessoa {
  nome: string,
  descricao: string,
  telefone: string,
  celular: string,
  email: string
}

interface Pessoa {
  id: string | string[],
  cpfCnpj: string,
  nome: string,
  fantasia: string,
  rgInscEstadual: string,
  inscMunicipal: string,
  telefone: string,
  celular: string,
  email: string,
  cep: string,
  logradouro: string,
  numeroLogradouro: string,
  bairro: string,
  complementoLogradouro: string,
  cidade: string,
  uf: string,
  grupoId: string | string[],
  categoriaId: string | string[],
  ativo: boolean,
  contatos: Array<ContatosPessoa>
}

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
        retorno.error = retorno.error[0].message;
      }
      if (response.data.data && !retorno.error) {
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

export default {
  async login(params: LoginParameters) {
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
        variables: params,
      }),
    );
  },
  async findEmpresaById(authEmpresa: string | string[]) {
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
  async salvarGrupoPessoa(params: EntidadeWith2Fields) {
    return getResponseData(
      await api.post('', {
        query: `
      mutation (
        $id: UUID
        $descricao: String!
      ) {
        salvarGrupoPessoa (
          id: $id,
          descricao: $descricao
        ) {
          id
        }
      }`,
        variables: params,
      }),
    );
  },
  async deletarGrupoPessoa(id) {
    return getResponseData(
      await api.post('', {
        query: `
      mutation (
        $id: UUID!
      ) {
        deletarGrupoPessoa (
          id: $id
        )
      }`,
        variables: {
          id,
        },
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
  async salvarCategoriaPessoa(params: EntidadeWith2Fields) {
    return getResponseData(
      await api.post('', {
        query: `
      mutation (
        $id: UUID
        $descricao: String!
      ) {
        salvarCategoriaPessoa (
          id: $id,
          descricao: $descricao
        ) {
          id
        }
      }`,
        variables: params,
      }),
    );
  },
  async deletarCategoriaPessoa(id) {
    return getResponseData(
      await api.post('', {
        query: `
      mutation (
        $id: UUID!
      ) {
        deletarCategoriaPessoa (
          id: $id
        )
      }`,
        variables: {
          id,
        },
      }),
    );
  },
  async consultarCEP(cep: string) {
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
  async consultarCNPJ(cnpj: string) {
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
          grupoId
          categoriaId
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
  async salvarPessoa(pessoa: Pessoa) {
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
        variables: pessoa,
      }),
    );
  },
};
