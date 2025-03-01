import { ChatMessage } from "../types/chat-message.js";
import { Patient } from "../types/patient.js";
export declare const getPatientAge: (patient: Patient) => number;
export declare const getPatientMetaInformation: (patient: Patient, language: string) => string;
export declare const assistantTranslations: Map<string, string>;
export declare const patientTranslations: Map<string, string>;
export declare const getMessageAuthor: (message: ChatMessage, language?: string) => string;
export declare const messagesAsFormattedString: (messages: Array<ChatMessage>, language: string) => string;
export declare const conversationHistoryTranslations: Map<string, string>;
export declare const languageNames: Map<string, string>;
export declare const replyInLanguageTranslations: Map<string, string>;
//# sourceMappingURL=templates.d.ts.map