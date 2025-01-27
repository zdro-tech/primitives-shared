import { ThreadStageTypes } from "./thread.js";
export interface ChatMessage {
    id: number;
    text: string;
    status: MessagePropagation;
    author: MessageAuthor;
    threadStage: ThreadStageTypes;
    class: MessageClass;
    type: MessageType;
    createdAt: Date;
    files?: FileData[];
}
export declare enum MessageType {
    Text = 0,
    Markdown = 1
}
export interface FileData {
    threadId: string;
    fileData?: string;
    fileBuffer?: Buffer;
    fileName: string;
    fileDescription?: string;
    uuid: string;
    bucketFileName: string;
}
export declare enum MessageAuthor {
    Patient = 0,
    Bot = 1,
    System = 2,
    Doctor = 3
}
export declare enum MessagePropagation {
    Local = 0,
    Remote = 1
}
export declare enum MessageClass {
    MEDICAL_INFORMATION = 0,
    GREETINGS = 1,
    GRATITUDE = 2,
    OFFTOPIC = 3,
    OFFTOPIC_WARNING = 4,
    CONTAINS_QUESTIONS = 5,
    CONTAINS_QUESTIONS_NOTIFICATION = 6,
    TOO_SHORT_TEXT = 7,
    TOO_SHORT_TEXT_WARNING = 8,
    CHILD_RELATED = 9,
    CHILD_RELATED_WARNING = 10,
    LIFE_THREATENING = 11,
    LIFE_THREATENING_WARNING = 12,
    SYSTEM_REPLY = 13,
    CHAT_REPLY = 14,
    UNIDENTIFIED = 15,
    PAYMENT = 16,
    RESULTS_DISPATCHED = 17
}
export interface ChatMessageRequest {
    id: number;
    text: string;
    status?: MessagePropagation;
    author?: MessageAuthor;
}
//# sourceMappingURL=chat-message.d.ts.map