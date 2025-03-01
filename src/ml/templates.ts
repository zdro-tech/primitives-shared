import { tt } from "../i18n/i18n.js";
import { ChatMessage, MessageAuthor } from "../types/chat-message.js";
import { Patient } from "../types/patient.js";
import { chatMessageWithFilesToText } from "./ml-basics.js";

export const getPatientAge = (patient: Patient): number => {
    if (!patient?.dateOfBirth) {
        return -1;
    }
    const birthDate = new Date(patient?.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthday =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    if (!hasHadBirthday) {
        age--;
    }
    return age;
};

const PATIENT_META_INFORMATION_TEXT = new Map<string, string>([
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

export const getPatientMetaInformation = (patient: Patient, language: string): string => {
    let prompt = PATIENT_META_INFORMATION_TEXT.get("en")
    if (PATIENT_META_INFORMATION_TEXT.has(language)) {
        prompt = PATIENT_META_INFORMATION_TEXT.get(language)
    }
    prompt = prompt?.replace("{firstName}", patient?.firstName).replace("{gender}", patient?.gender).replace("{age}", getPatientAge(patient)?.toString());
    if (!patient) {
        return ""
    }
    return prompt ?? "";
}

export const assistantTranslations = new Map<string, string>([
    ["en", "Assistant"],
    ["pl", "Asystent"],
    ["uk", "Асистент"],
    ["ru", "Ассистент"]
]);
export const patientTranslations = new Map<string, string>([
    ["en", "Patient"],
    ["pl", "Pacjent"],
    ["uk", "Пацієнт"],
    ["ru", "Пациент"]
]);
export const getMessageAuthor = (message: ChatMessage, language = "en"): string => {
    return [MessageAuthor.Bot, MessageAuthor.Doctor].includes(message.author) ? tt(assistantTranslations, language) : tt(patientTranslations, language)
}

export const messagesAsFormattedString = (messages: Array<ChatMessage>, language: string): string => {
    return `${tt(conversationHistoryTranslations, language)}: 
    <conversation_history>
    ${messages.map(m => `${getMessageAuthor(m)}: ${chatMessageWithFilesToText(m)}`).join("\n")}
    </conversation_history>`
}

export const conversationHistoryTranslations = new Map<string, string>([
    ["en", "Conversation history"],
    ["pl", "Historia rozmowy"],
    ["uk", "Історія розмови"],
    ["ru", "История разговора"]
]);

export const languageNames = new Map<string, string>([
    ["en", "English"],
    ["pl", "Polski"],
    ["uk", "Українська"],
    ["ru", "Русский"]
]);

export const replyInLanguageTranslations = new Map<string, string>([
    ["en", "Reply in the language"],
    ["pl", "Odpowiedz w języku"],
    ["uk", "Відповідай мовою"],
    ["ru", "Ответь на языке"]
]);