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
  }
}