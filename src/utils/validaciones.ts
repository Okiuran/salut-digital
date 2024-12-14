export const validateNombre = (nombre: string, language: string): string => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)
      ? ''
      : language === 'es'
      ? 'El nombre solo puede contener letras.'
      : 'El nom només pot contenir lletres.';
  };

  export const validateApellidos = (apellidos: string, language: string): string => {
    return /^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)$/.test(apellidos)
      ? ''
      : language === 'es'
      ? 'Introduce los dos apellidos separados por un espacio.'
      : 'Introdueix els dos cognoms separats per un espai.';
  };

  export const validateTarjetaSanitaria = (
    // La tarjeta sanitaria tiene este formato: 4 letras y una serie de números con espacios (XXXX X XXXXXX XX X)
    tarjetaSanitaria: string,
    language: string
  ): string => {
    return /^[A-Z]{2}[A-Z]{2}\s\d\s\d{6}\s\d{2}\s\d$/.test(tarjetaSanitaria)
      ? ''
      : language === 'es'
      ? 'Formato incorrecto de tarjeta sanitaria.'
      : 'Format incorrecte de targeta sanitària.';
  };

  export const validateDNI = (dni: string, language: string): string => {
    return /^\d{8}[A-Z]$/.test(dni)
      ? ''
      : language === 'es'
      ? 'Formato incorrecto de DNI.'
      : 'Format incorrecte de DNI.';
  };

  export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };