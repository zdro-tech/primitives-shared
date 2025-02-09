import { tt } from "../i18n/i18n.js";
import { MessageAuthor } from "../types/chat-message.js";
import { chatMessageWithFilesToText } from "./ml-basics.js";
export const getPatientAge = (patient) => {
    if (!patient?.dateOfBirth) {
        return -1;
    }
    const birthDate = new Date(patient?.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthday = today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    if (!hasHadBirthday) {
        age--;
    }
    return age;
};
const PATIENT_META_INFORMATION_TEXT = new Map([
    ["en", `Patient meta information: 
        <patient_meta_info>
            Patient name: {firstName}, gender {gender} and age {age}
        </patient_meta_info>`],
    ["uk", `Метадані пацієнта: 
        <patient_meta_info>
            Ім'я пацієнта: {firstName}, стать: {gender} та вік: {age}
        </patient_meta_info>`],
    ["ru", `Метаданные пациента: 
        <patient_meta_info>
            Имя пациента: {firstName}, пол: {gender} и возраст: {age}
        </patient_meta_info>`],
    ["pl", `Metadane pacjenta: 
        <patient_meta_info>
            Imię pacjenta: {firstName}, płeć: {gender} oraz wiek: {age}
        </patient_meta_info>`]
]);
export const getPatientMetaInformation = (patient, language) => {
    let prompt = PATIENT_META_INFORMATION_TEXT.get("en");
    if (PATIENT_META_INFORMATION_TEXT.has(language)) {
        prompt = PATIENT_META_INFORMATION_TEXT.get(language);
    }
    prompt = prompt?.replace("{firstName}", patient?.firstName).replace("{gender}", patient?.gender).replace("{age}", getPatientAge(patient)?.toString());
    if (!patient) {
        return "";
    }
    return prompt ?? "";
};
export const getMessageAuthor = (message) => {
    return [MessageAuthor.Bot, MessageAuthor.Doctor].includes(message.author) ? "You" : "Patient";
};
export const messagesAsFormattedString = (messages, language) => {
    return `${tt(conversationHistoryTranslations, language)}: 
    <conversation_history>
    ${messages.map(m => `${getMessageAuthor(m)}: ${chatMessageWithFilesToText(m)}`).join("\n")}
    </conversation_history>`;
};
export const conversationHistoryTranslations = new Map([
    ["en", "Here is the conversation history so far"],
    ["pl", "Oto dotychczasowa historia rozmowy"],
    ["uk", "Ось історія розмови до цього моменту"],
    ["ru", "Вот история разговора на данный момент"]
]);
export const languageNames = new Map([
    ["en", "English"],
    ["pl", "Polski"],
    ["uk", "Українська"],
    ["ru", "Русский"]
]);
export const replyInLanguageTranslations = new Map([
    ["en", "Reply in the language"],
    ["pl", "Odpowiedz w języku"],
    ["uk", "Відповідай мовою"],
    ["ru", "Ответь на языке"]
]);
