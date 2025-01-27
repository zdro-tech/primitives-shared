import { ThreadStageTypes } from "./thread.js"

export interface ChatMessage {
    id: number
    text: string
    status: MessagePropagation
    author: MessageAuthor
    threadStage: ThreadStageTypes
    class: MessageClass
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
    MEDICAL_INFORMATION,
    GREETINGS,
    GRATITUDE,
    OFFTOPIC,
    OFFTOPIC_WARNING,
    CONTAINS_QUESTIONS,
    CONTAINS_QUESTIONS_NOTIFICATION,
    TOO_SHORT_TEXT,
    TOO_SHORT_TEXT_WARNING,
    CHILD_RELATED,
    CHILD_RELATED_WARNING,
    LIFE_THREATENING,
    LIFE_THREATENING_WARNING,
    SYSTEM_REPLY,
    CHAT_REPLY,
    UNIDENTIFIED,
    PAYMENT,
    RESULTS_DISPATCHED
}

export interface ChatMessageRequest {
    id: number
    text: string
    status?: MessagePropagation
    author?: MessageAuthor
}