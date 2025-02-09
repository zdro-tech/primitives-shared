export const DEFAULT_LANGUAGE = "pl";
export const findI18NLabelInTexts = (texts, lang, key) => {
    if (!texts[lang]) {
        lang = DEFAULT_LANGUAGE;
    }
    const langTexts = texts[lang];
    if (!langTexts[key]) {
        return key;
    }
    return langTexts[key];
};
export const tt = (instructions, lang) => {
    return instructions.get(lang) || instructions.get('en');
};
