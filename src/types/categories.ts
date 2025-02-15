export interface UserFacingCategory {
    id: number;
    code: string;
    en: string;
    pl: string;
    ru: string;
    ua: string;
}

export interface QuickAction {
    id: number;
    userFacingCategoryId: number;
    code: string;
    en: string;
    pl: string;
    ru: string;
    ua: string;
}

export interface CategoryWithQuickActions extends UserFacingCategory {
    quickActions: QuickAction[];
}
