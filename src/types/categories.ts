export interface ThreadCategory {
    id: number;
    icdTitle: string;
    en: string;
    pl: string;
    ru: string;
    ua: string;
}

export interface ChatQuickAction {
    id: number;
    threadsCategoryId: number;
    code: string;
    en: string;
    pl: string;
    ru: string;
    ua: string;
}