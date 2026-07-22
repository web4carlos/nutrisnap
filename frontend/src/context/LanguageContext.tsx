/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useState,
    type ReactNode
} from "react";

import i18n from "../i18n";

type Language = "en" | "es";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext =
createContext<LanguageContextType | null>(null);

export function LanguageProvider({
    children,
}:{
    children:ReactNode;
}){

    const [language,setLanguageState] =
    useState<Language>(
        (localStorage.getItem("language") as Language) || "en"
    );

    const setLanguage=(lang:Language)=>{

        setLanguageState(lang);

        localStorage.setItem("language",lang);

        i18n.changeLanguage(lang);

    };

    return(

        <LanguageContext.Provider
            value={{
                language,
                setLanguage
            }}
        >

            {children}

        </LanguageContext.Provider>

    );

}

export function useLanguage(){

    const context = useContext(LanguageContext);

    if(!context){

        throw new Error("LanguageProvider missing");

    }

    return context;

}