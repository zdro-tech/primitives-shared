export interface StoredUnreadMessage {
    messageID: number;
    userID?: string;
    storedAt?: number;
    userType?: 'patient' | 'doctor';
}

export interface ThreadUnreadMessages {
    threadID: string;
    messages: StoredUnreadMessage[]
}