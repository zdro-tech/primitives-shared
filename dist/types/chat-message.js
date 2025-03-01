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
    MessageClass["SYSTEM_REPLY"] = "SYSTEM_REPLY";
    MessageClass["CHAT_REPLY"] = "CHAT_REPLY";
    MessageClass["SECONDARY_CHAT_REPLY"] = "SECONDARY_CHAT_REPLY";
    MessageClass["UNIDENTIFIED"] = "UNIDENTIFIED";
    MessageClass["PAYMENT"] = "PAYMENT";
    MessageClass["RESULTS_DISPATCHED"] = "RESULTS_DISPATCHED";
    MessageClass["DOCTOR_JOINED"] = "DOCTOR_JOINED";
})(MessageClass || (MessageClass = {}));
