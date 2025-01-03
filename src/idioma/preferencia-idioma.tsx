import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../utils/traduccion.ts';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (key: string) => string;  // Función para traducir
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('es');  // Idioma por defecto

  const translate = (key: string) => {
    const keys = key.split('.');  // Por ejemplo, 'login.title' se divide en ['login', 'title']
    let translation = translations[language];
    keys.forEach(k => {
      if (translation) translation = translation[k];
    });
    return translation || key;  // Si no encuentra la traducción, devuelve la clave
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
};
