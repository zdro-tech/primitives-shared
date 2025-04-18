import { ChatMessage, ChatMessageRequest } from "./chat-message.js";
import { ChatThread, ThreadCreationContext } from "./thread.js";
export interface NewChatRequest {
    language: string;
}
export interface BasicAuthorizedRequest {
}
export interface GetAllThreadsRequest extends BasicAuthorizedRequest {
    language: string;
}
export interface BasicThreadRequest extends BasicAuthorizedRequest {
    threadID: string;
}
export interface NewThreadRequest extends BasicAuthorizedRequest {
    language: string;
    metaData: {
        creationContext?: ThreadCreationContext;
    };
}
export interface NewThreadMessageRequest extends BasicThreadRequest {
    message: ChatMessageRequest;
}
export interface GetMessagesRequest extends BasicThreadRequest {
}
export interface NewPatientResponse {
    id: string;
}
export interface NewThreadResponse {
    thread: ChatThread;
}
export interface ThreadUpdateResponse {
    thread: ChatThread;
}
export interface GetAllThreadsResponse {
    threads: Array<ChatThread>;
}
export interface NewThreadMessageConfirmation {
    message: ChatMessage;
}
export interface GetMessagesResponse {
    messages: Array<ChatMessage>;
}
//# sourceMappingURL=chat-definitions.d.ts.map