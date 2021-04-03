/* eslint-disable class-methods-use-this */
class AuthService {
  signOut() {
    this.removeToken();
    this.removeLogoEmpresa();
    this.removeIdentificadorEmpresa();
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      this.removeToken();
    }
  }

  getToken() {
    return localStorage.getItem('ACCESS_TOKEN');
  }

  removeToken() {
    localStorage.removeItem('ACCESS_TOKEN');
  }

  setIdentificadorEmpresa(id) {
    if (id) {
      localStorage.setItem('IDENTIFICADOR_EMPRESA', id);
    } else {
      this.removeIdentificadorEmpresa();
    }
  }

  getIdentificadorEmpresa() {
    return localStorage.getItem('IDENTIFICADOR_EMPRESA');
  }

  removeIdentificadorEmpresa() {
    //localStorage.removeItem('IDENTIFICADOR_EMPRESA');
  }

  setLogoEmpresa(logo) {
    if (logo) {
      localStorage.setItem('LOGO_EMPRESA', logo);
    } else {
      this.removeLogoEmpresa();
    }
  }

  getLogoEmpresa() {
    return localStorage.getItem('LOGO_EMPRESA');
  }

  removeLogoEmpresa() {
    localStorage.removeItem('LOGO_EMPRESA');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

const authService = new AuthService();

export default authService;
