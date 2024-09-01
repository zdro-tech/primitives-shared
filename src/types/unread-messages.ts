export interface StoredUnreadMessage {
    userID: string;
    messageID: number;
}

export interface ThreadUnreadMessages {
    threadID: string;
    messages: StoredUnreadMessage[]
}