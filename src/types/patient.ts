import { logger } from "../logger/index.js";

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    governmentalIdentifier: string;
    phoneNumber: string;
    email: string;
    city: string;
    postalCode: string;
    streetName: string;
    houseNumber: string;
    unitId: string;
    country: string;
    tenantId: number;
    language: string;
    createdAt: Date;
}

export const getPatientAge = (patient: Patient): number => {
    const birthDate = new Date(patient.dateOfBirth);
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
    ["en", "Meta information: ### Patient name: {firstName}, gender {gender} and age {age} ###"],
    ["uk", "Мета-інформація: ### Ім'я пацієнта: {firstName}, стать {gender} та вік {age} ###"],
    ["ru", "Метаданные: ### Имя пациента: {firstName}, пол {gender} и возраст {age} ###"],
    ["pl", "Meta informacje: ### Imię pacjenta: {firstName}, płeć {gender} i wiek {age} ###"]
])

export const getPatientMetaInformation = (patient: Patient, language: string): string => {
    let prompt = PATIENT_META_INFORMATION_TEXT.get("en")
    if (PATIENT_META_INFORMATION_TEXT.has(language)) {
        prompt = PATIENT_META_INFORMATION_TEXT.get(language)
    }
    prompt = prompt?.replace("{firstName}", patient?.firstName).replace("{gender}", patient?.gender).replace("{age}", getPatientAge(patient)?.toString());
    if (!patient) {
        logger.error("No patient provided for meta information extraction")
        return ""
    }
    return prompt ?? "";
}