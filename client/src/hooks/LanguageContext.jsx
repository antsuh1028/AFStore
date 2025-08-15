import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: "en",
    name: "English",
    flag: "https://flagcdn.com/w20/us.png",
    country: "United States",
    currency: "USD $"
  });

  const languages = [
    {
      code: "en",
      name: "English", 
      flag: "https://flagcdn.com/w20/us.png",
      country: "United States",
      currency: "USD $"
    },
    {
      code: "ko",
      name: "한국어",
      flag: "https://flagcdn.com/w20/kr.png", 
      country: "대한민국",
      currency: "USD $"
    }
  ];

  const changeLanguage = (language) => {
    setSelectedLanguage(language);
    // Here you can add translation logic
    // console.log("Language changed to:", language);
  };

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      languages,
      changeLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};