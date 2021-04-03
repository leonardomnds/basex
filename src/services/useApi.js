import api from '../util/Api';

const getResponseData = (response) => {
  try {
    if (!response.data) {
      return null;
    }
    return response.data;
  } catch (error) {
    return error.message;
  }  
}

module.exports = {
  async login(authEmpresa, usuario, senha) {
    return getResponseData(await api.post('', {
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
      variables: { authEmpresa, usuario, senha }
    }));
  },
  async findEmpresaById(authEmpresa) {
    return getResponseData(await api.post('', {
      query: `
        query ($authEmpresa: String!) {
          infoEmpresa(
            identificadorEmpresa: $authEmpresa,
          ) {
            fantasia,
            logoBase64
          }
        }`,
      variables: { authEmpresa }
    }));
  },
  async getListaPessoas() {
    return getResponseData(await api.post('', {
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
    }));
  },
  async getListaEstados() {
    return getResponseData(await api.post('', {
      query: `
      query {
        estados {
          uf
          descricao
        }
      }`,
    }));
  },
  async getCidadesByUF(uf) {
    return getResponseData(await api.post('', {
      query: `
      query ($uf: String!) {
        cidades(
          uf: $uf
        ) {
          id
          descricao
        }
      }`,
      variables: { uf }
    }));
  },
  async getGruposPessoas() {
    return getResponseData(await api.post('', {
      query: `
      query {
        gruposPessoa {
          id
          descricao
        }
      }`
    }));
  },
  async getCategoriasPessoas() {
    return getResponseData(await api.post('', {
      query: `
      query {
        categoriasPessoa {
          id
          descricao
        }
      }`
    }));
  },
  async consultarCEP(cep) {
    return getResponseData(await api.post('', {
      query: `
      query ($cep: String!) {
        consultarCep(cep: $cep) {
          cep
          logradouro
          bairro
          complemento
          cidade {
            id
            descricao
            uf
          }
        }
      }`,
      variables: { cep }
    }));
  },
  async consultarCNPJ(cnpj) {
    return getResponseData(await api.post('', {
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
            cidade {
              id
              descricao
              uf
            }
          }
        }
      }`,
      variables: { cnpj }
    }));
  },
  async getPessoa(id) {
    return getResponseData(await api.post('', {
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
          ativo
        }
      }`,
      variables: { id }
    }));
  },
}