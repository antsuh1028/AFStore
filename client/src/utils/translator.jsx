import { useLanguage } from "../hooks/LanguageContext";
export const translator = (englishText, koreanText) => {
  const { selectedLanguage } = useLanguage();
    return selectedLanguage.code === "ko" ? koreanText : englishText;
  };