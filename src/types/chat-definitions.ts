
import { ChatMessage, ChatMessageRequest, MessageAuthor } from "./chat-message.js"
import { ChatThread } from "./thread.js"


export interface NewChatRequest {
    language: string
}

export interface BasicAuthorizedRequest {
}

export interface GetAllThreadsRequest extends BasicAuthorizedRequest {
    language: string
}

export interface BasicThreadRequest extends BasicAuthorizedRequest {
    threadID: string
}

export interface NewThreadRequest extends BasicAuthorizedRequest {
    language: string
    meta: ThreadMetaData
}

export interface ThreadMetaData {
    creationContext: "generic-question" | "extend-meds" | "explain-tests" | "request-tests" | "request-risks" | "no-energy" | "no-self-confidence" | "bad-skin" | "dry-eyes" | "" | "" | "" | "" | undefined
}

export interface NewThreadMessageRequest extends BasicThreadRequest {
    message: ChatMessageRequest
}

export interface GetMessagesRequest extends BasicThreadRequest {

}

export interface NewPatientResponse {
    id: string
}

export interface NewThreadResponse {
    thread: ChatThread
}

export interface ThreadUpdateResponse {
    thread: ChatThread
}

export interface GetAllThreadsResponse {
    threads: Array<ChatThread>
}

export interface NewThreadMessageConfirmation {
    message: ChatMessage
}

export interface GetMessagesResponse {
    messages: Array<ChatMessage>
}


