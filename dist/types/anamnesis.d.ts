declare enum MedicalQuestionCategories {
    SICK_LEAVE = "SICK_LEAVE",
    PRESCRIPTION = "PRESCRIPTION",
    CONTRACEPTION = "CONTRACEPTION"
}
export interface InitiationPhaseMedicalIssueValidation {
    described: number;
}
export interface InitiationPhaseMedicalEvaluation {
    categories: Array<MedicalQuestionCategories>;
    regularity: number;
}
export interface OpenAIQuestionValidationResponse {
    answered: number;
}
export interface OpenAIQuestionClarificationResponse {
    clarifyingQuestion: string;
}
export interface OpenAIQuestionSummaryResponse {
    summary: string;
}
export interface OpenAIThreadAnswersCompletenessResponse {
    completeness: number;
}
export interface OpenAIAnamnesisQuestion {
    q: string;
    type: string;
}
export interface GenericQuestion {
    id: number;
    q: string;
    threadID: string;
}
export interface AnamnesisQuestion extends GenericQuestion {
    type: AnamnesisQuestionType;
    answerSummary: string;
}
export declare enum AnamnesisQuestionType {
    ACCOMPANYING_SYMPTOMS = 0,
    ONSET = 1,// When the symptoms started
    LOCATION = 2,// Where the patient feels the symptom
    DURATION = 3,// How long the symptoms have been present
    CHARACTER = 4,// The nature or type of the symptoms
    ALLEVIATING_AGGRAVATING = 5,// What makes the symptoms better or worse
    SEVERITY = 6,// The intensity of the symptoms
    HPI = 7,// History of Present Illness: Brief narrative of the patient's current complaints
    SUBJECTIVE = 8,// The patient’s description of the problem or condition
    SYMPTOMS = 9,
    HISTORY = 10,
    ALLERGIES = 11,
    MEDS = 12,
    SENSATIONS = 13,
    TIMELINE = 14,
    CHANGES = 15,
    LIFESTYLE = 16,
    HABITS = 17,
    DIAGNOSTIC_TESTS = 18,
    MENTAL_STATE = 19,
    ENVIRONMENTAL = 20,
    OTHER = 21
}
export {};
//# sourceMappingURL=anamnesis.d.ts.map