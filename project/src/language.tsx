import {createContext, useContext} from 'react';

export type ReelLanguage = 'en' | 'vi';

const LanguageContext = createContext<ReelLanguage>('en');

export const LanguageProvider = LanguageContext.Provider;

export const useReelLanguage = () => useContext(LanguageContext);
