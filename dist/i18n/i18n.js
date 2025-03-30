import get from 'get-value';
export const DEFAULT_LANGUAGE = "pl";
export const findI18NLabelInTexts = (texts, lang, key) => {
    const langTexts = texts[lang] ?? texts[DEFAULT_LANGUAGE];
    if (typeof langTexts !== 'object' || langTexts === null)
        return key;
    const value = get(langTexts, key);
    return value ?? '';
};
export const hasI18NKey = (texts, lang, key) => {
    const langTexts = texts[lang] ?? texts[DEFAULT_LANGUAGE];
    if (typeof langTexts !== 'object' || langTexts === null)
        return false;
    return get(langTexts, key) !== undefined;
};
export const tt = (instructions, lang) => {
    return instructions.get(lang) || instructions.get('en');
};
