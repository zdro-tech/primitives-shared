export type Texts = {
    [key: string]: string | Texts;
};
export declare const DEFAULT_LANGUAGE = "pl";
export declare const findI18NLabelInTexts: (texts: Texts, lang: string, key: string) => string;
export declare const hasI18NKey: (texts: Texts, lang: string, key: string) => boolean;
export declare const tt: (instructions: Map<string, string>, lang: string) => string;
//# sourceMappingURL=i18n.d.ts.map