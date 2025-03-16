import { ThreadStageType } from "./thread.js"

export interface ChatMessage {
    id: number
    text: string
    status: MessagePropagation
    author: MessageAuthor
    threadStage: ThreadStageType
    messageClass: MessageClass
    type: MessageType
    createdAt: Date,
    files?: FileData[]
}

export enum MessageType {
    Text,
    Markdown
}

export interface FileData {
    threadId: string;
    fileData?: string;
    fileBuffer?: Buffer; //for base64 altermative
    fileName: string; // original file name
    fileDescription?: string;
    uuid: string;  // short file name in bucket
    bucketFileName: string; // full path in bucket
}

export enum MessageAuthor {
    Patient,
    Bot,
    System,
    Doctor
}
export enum MessagePropagation {
    Local,
    Remote
}

export enum MessageClass {
    MEDICAL_INFORMATION = "MEDICAL_INFORMATION",
    SYSTEM_REPLY = "SYSTEM_REPLY",
    CHAT_REPLY = "CHAT_REPLY",
    SECONDARY_CHAT_REPLY = "SECONDARY_CHAT_REPLY",
    UNIDENTIFIED = "UNIDENTIFIED",
    PAYMENT = "PAYMENT",
    RESULTS_DISPATCHED = "RESULTS_DISPATCHED",
    DOCTOR_JOINED = "DOCTOR_JOINED"
}

export interface ChatMessageRequest {
    id: number
    text: string
    status?: MessagePropagation
    author?: MessageAuthor
}