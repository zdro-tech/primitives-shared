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
    MessageClass["MEDICAL_INFORMATION"] = "MEDICAL_INFORMATION";
    MessageClass["GREETINGS"] = "GREETINGS";
    MessageClass["GRATITUDE"] = "GRATITUDE";
    MessageClass["OFFTOPIC"] = "OFFTOPIC";
    MessageClass["OFFTOPIC_WARNING"] = "OFFTOPIC_WARNING";
    MessageClass["CONTAINS_QUESTIONS"] = "CONTAINS_QUESTIONS";
    MessageClass["CONTAINS_QUESTIONS_NOTIFICATION"] = "CONTAINS_QUESTIONS_NOTIFICATION";
    MessageClass["TOO_SHORT_TEXT"] = "TOO_SHORT_TEXT";
    MessageClass["TOO_SHORT_TEXT_WARNING"] = "TOO_SHORT_TEXT_WARNING";
    MessageClass["CHILD_RELATED"] = "CHILD_RELATED";
    MessageClass["CHILD_RELATED_WARNING"] = "CHILD_RELATED_WARNING";
    MessageClass["LIFE_THREATENING"] = "LIFE_THREATENING";
    MessageClass["LIFE_THREATENING_WARNING"] = "LIFE_THREATENING_WARNING";
    MessageClass["SYSTEM_REPLY"] = "SYSTEM_REPLY";
    MessageClass["CHAT_REPLY"] = "CHAT_REPLY";
    MessageClass["UNIDENTIFIED"] = "UNIDENTIFIED";
    MessageClass["PAYMENT"] = "PAYMENT";
    MessageClass["RESULTS_DISPATCHED"] = "RESULTS_DISPATCHED";
    MessageClass["DOCTOR_JOINED"] = "DOCTOR_JOINED";
})(MessageClass || (MessageClass = {}));
