export var MessageType;
(function (MessageType) {
    MessageType[MessageType["Text"] = 0] = "Text";
    MessageType[MessageType["Markdown"] = 1] = "Markdown";
})(MessageType || (MessageType = {}));
export var MessageAuthor;
(function (MessageAuthor) {
    MessageAuthor[MessageAuthor["Patient"] = 0] = "Patient";
    MessageAuthor[MessageAuthor["Bot"] = 1] = "Bot";
    MessageAuthor[MessageAuthor["System"] = 2] = "System";
    MessageAuthor[MessageAuthor["Doctor"] = 3] = "Doctor";
})(MessageAuthor || (MessageAuthor = {}));
export var MessagePropagation;
(function (MessagePropagation) {
    MessagePropagation[MessagePropagation["Local"] = 0] = "Local";
    MessagePropagation[MessagePropagation["Remote"] = 1] = "Remote";
})(MessagePropagation || (MessagePropagation = {}));
export var MessageClass;
(function (MessageClass) {
    MessageClass[MessageClass["MEDICAL_INFORMATION"] = 0] = "MEDICAL_INFORMATION";
    MessageClass[MessageClass["GREETINGS"] = 1] = "GREETINGS";
    MessageClass[MessageClass["GRATITUDE"] = 2] = "GRATITUDE";
    MessageClass[MessageClass["OFFTOPIC"] = 3] = "OFFTOPIC";
    MessageClass[MessageClass["OFFTOPIC_WARNING"] = 4] = "OFFTOPIC_WARNING";
    MessageClass[MessageClass["CONTAINS_QUESTIONS"] = 5] = "CONTAINS_QUESTIONS";
    MessageClass[MessageClass["CONTAINS_QUESTIONS_NOTIFICATION"] = 6] = "CONTAINS_QUESTIONS_NOTIFICATION";
    MessageClass[MessageClass["TOO_SHORT_TEXT"] = 7] = "TOO_SHORT_TEXT";
    MessageClass[MessageClass["TOO_SHORT_TEXT_WARNING"] = 8] = "TOO_SHORT_TEXT_WARNING";
    MessageClass[MessageClass["CHILD_RELATED"] = 9] = "CHILD_RELATED";
    MessageClass[MessageClass["CHILD_RELATED_WARNING"] = 10] = "CHILD_RELATED_WARNING";
    MessageClass[MessageClass["LIFE_THREATENING"] = 11] = "LIFE_THREATENING";
    MessageClass[MessageClass["LIFE_THREATENING_WARNING"] = 12] = "LIFE_THREATENING_WARNING";
    MessageClass[MessageClass["SYSTEM_REPLY"] = 13] = "SYSTEM_REPLY";
    MessageClass[MessageClass["CHAT_REPLY"] = 14] = "CHAT_REPLY";
    MessageClass[MessageClass["UNIDENTIFIED"] = 15] = "UNIDENTIFIED";
    MessageClass[MessageClass["PAYMENT"] = 16] = "PAYMENT";
})(MessageClass || (MessageClass = {}));
