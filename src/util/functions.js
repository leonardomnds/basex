import cookie from 'js-cookie';

export const SomenteNumeros = (str) => {
  let onlyNumbers = '';
  const value = str || '';
  for (let i = 0; i < value.length; i += 1) {
    const char = value.substring(i, i + 1);
    if ('0123456789'.includes(char)) {
      onlyNumbers += char;
    }
  }
  return onlyNumbers;
};

export const FormatarCpfCnpj = (str) => {
  const doc = SomenteNumeros(str);

  let parte1 = '';
  let parte2 = '';
  let parte3 = '';
  let parte4 = '';
  let parte5 = '';

  if (doc.length <= 11) {
    // CPF
    parte1 = doc.substring(0, 3);
    parte2 = doc.substring(3, 6);
    parte3 = doc.substring(6, 9);
    parte4 = doc.substring(9, 11);

    if (parte2.length > 0) {
      parte2 = `.${parte2}`;
    }
    if (parte3.length > 0) {
      parte3 = `.${parte3}`;
    }
    if (parte4.length > 0) {
      parte4 = `-${parte4}`;
    }
  } else {
    // CNPJ
    parte1 = doc.substring(0, 2);
    parte2 = doc.substring(2, 5);
    parte3 = doc.substring(5, 8);
    parte4 = doc.substring(8, 12);
    parte5 = doc.substring(12, 14);

    if (parte2.length > 0) {
      parte2 = `.${parte2}`;
    }
    if (parte3.length > 0) {
      parte3 = `.${parte3}`;
    }
    if (parte4.length > 0) {
      parte4 = `/${parte4}`;
    }
    if (parte5.length > 0) {
      parte5 = `-${parte5}`;
    }
  }

  return parte1 + parte2 + parte3 + parte4 + parte5 || '';
};

export const FormatarCpf = (str) => {
  const cpf = SomenteNumeros(str);

  const parte1 = cpf.substring(0, 3);
  let parte2 = cpf.substring(3, 6);
  let parte3 = cpf.substring(6, 9);
  let parte4 = cpf.substring(9, 11);

  if (parte2.length > 0) {
    parte2 = `.${parte2}`;
  }
  if (parte3.length > 0) {
    parte3 = `.${parte3}`;
  }
  if (parte4.length > 0) {
    parte4 = `-${parte4}`;
  }

  return parte1 + parte2 + parte3 + parte4;
};

export const FormatarCnpj = (str) => {
  const cnpj = SomenteNumeros(str);
  const parte1 = cnpj.substring(0, 2);
  let parte2 = cnpj.substring(2, 5);
  let parte3 = cnpj.substring(5, 8);
  let parte4 = cnpj.substring(8, 12);
  let parte5 = cnpj.substring(12, 14);

  if (parte2.length > 0) {
    parte2 = `.${parte2}`;
  }
  if (parte3.length > 0) {
    parte3 = `.${parte3}`;
  }
  if (parte4.length > 0) {
    parte4 = `/${parte4}`;
  }
  if (parte5.length > 0) {
    parte5 = `-${parte5}`;
  }

  return parte1 + parte2 + parte3 + parte4 + parte5;
};

export const FormatarCep = (str) => {
  const cnpj = SomenteNumeros(str);
  const parte1 = cnpj.substring(0, 5);
  let parte2 = cnpj.substring(5, 8);

  if (parte2.length > 0) {
    parte2 = `-${parte2}`;
  }

  return parte1 + parte2;
};

export const FormatarTelefone = (str) => {
  const fone = SomenteNumeros(str);
  let parte1 = fone.substring(0, 2);
  let parte2 = '';
  let parte3 = '';

  if (fone.length <= 10) {
    parte2 = fone.substring(2, 6);
    parte3 = fone.substring(6, 10);
  } else {
    parte2 = fone.substring(2, 7);
    parte3 = fone.substring(7, 11);
  }

  if (parte1.length > 0) {
    parte1 = `(${parte1}`;
  }
  if (parte2.length > 0) {
    parte2 = `) ${parte2}`;
  }
  if (parte3.length > 0) {
    parte3 = `-${parte3}`;
  }

  return parte1 + parte2 + parte3;
};

export const FormatarStringToMoney = (str) => {
  const valor = SomenteNumeros(str);
  const { length } = valor;

  if (length === 0) {
    return '0,00';
  }
  if (length === 1) {
    return `0,0${valor}`;
  }
  if (length === 2) {
    return `0,${valor}`;
  }

  const inteiro = valor.substring(0, valor.length - 2);
  const decimal = valor.substring(valor.length - 2, valor.length);

  return `${parseInt(inteiro, 10)},${decimal}`;
};

export const StringToDouble = (str) => {
  return parseFloat(str.replace(',', '.'));
};

export const StringToCurrency = (str) => {
  return `R$ ${str.replace('.', ',')}`;
};

export const DoubleToCurrency = (value, digits = 2) => {
  return `R$ ${value.toLocaleString('pt-br', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
};

export const ZerosLeft = (value, digits = 0) => {
  const str = value.toString();
  const pad = Array(digits + 1).join('0');
  return pad.substring(0, pad.length - str.length) + str;
};

export const ToBase64 = (value) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(value);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const GetTokenFromCookie = () => {
  const token = cookie.get('token');
  return token;
}

export const GetAxiosConfig = () => {
  const token = GetTokenFromCookie();
  return {
    headers: {
      Authotization: 'Bearer '+token
    }
  }
}