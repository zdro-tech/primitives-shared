interface ThreadCategory {
    id: number;
    icdTitle: string;
    translationEn: string;
    translationPl: string;
    translationRu: string;
    translationUa: string;
}

interface ChatQuickAction {
    id: number;
    threadsCategoryId: number;
    code: string;
    translationEn: string;
    translationPl: string;
    translationRu: string;
    translationUa: string;
}