export type Texts = {
    [key: string]: {
        [key: string]: string;
    };
};

export const DEFAULT_LANGUAGE = "pl";

export const findI18NLabelInTexts = (texts: Texts, lang: string, key: string): string => {
    if (!texts[lang]) {
        lang = DEFAULT_LANGUAGE;
    }

    const langTexts = texts[lang];
    if (!langTexts[key]) {
        return key;
    }
    return langTexts[key];
};

export const tt = (instructions: Map<string, string>, lang: string): string => {
    return instructions.get(lang) || instructions.get('en')!;
};