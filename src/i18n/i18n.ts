import get from 'get-value';

export type Texts = {
    [key: string]: string | Texts;
};

export const DEFAULT_LANGUAGE = "pl";

export const findI18NLabelInTexts = (texts: Texts, lang: string, key: string): string => {
    const langTexts = texts[lang] ?? texts[DEFAULT_LANGUAGE];
    if (typeof langTexts !== 'object' || langTexts === null) return key;
    const value = get(langTexts, key);
    return value ?? key
};

export const hasI18NKey = (texts: Texts, lang: string, key: string): boolean => {
    const langTexts = texts[lang] ?? texts[DEFAULT_LANGUAGE];
    if (typeof langTexts !== 'object' || langTexts === null) return false;
    return get(langTexts, key) !== undefined;
};


export const tt = (instructions: Map<string, string>, lang: string): string => {
    return instructions.get(lang) || instructions.get('en')!;
};