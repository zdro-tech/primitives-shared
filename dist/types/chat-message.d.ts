import { ThreadStageTypes } from "./thread.js";
export interface ChatMessage {
    id: number;
    text: string;
    status: MessagePropagation;
    author: MessageAuthor;
    threadStage: ThreadStageTypes;
    messageClass: MessageClass;
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
    MEDICAL_INFORMATION = "MEDICAL_INFORMATION",
    SYSTEM_REPLY = "SYSTEM_REPLY",
    CHAT_REPLY = "CHAT_REPLY",
    UNIDENTIFIED = "UNIDENTIFIED",
    PAYMENT = "PAYMENT",
    RESULTS_DISPATCHED = "RESULTS_DISPATCHED",
    DOCTOR_JOINED = "DOCTOR_JOINED"
}
export interface ChatMessageRequest {
    id: number;
    text: string;
    status?: MessagePropagation;
    author?: MessageAuthor;
}
//# sourceMappingURL=chat-message.d.ts.map