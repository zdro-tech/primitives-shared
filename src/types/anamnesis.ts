enum MedicalQuestionCategories {
    SICK_LEAVE = 'SICK_LEAVE',
    PRESCRIPTION = 'PRESCRIPTION',
    CONTRACEPTION = 'CONTRACEPTION'
}

export interface InitiationPhaseMedicalIssueValidation {
    described: number
}

export interface InitiationPhaseMedicalEvaluation {
    categories: Array<MedicalQuestionCategories>
    regularity: number
}

export interface OpenAIQuestionValidationResponse {
    answered: number
}

export interface OpenAIQuestionClarificationResponse {
    clarifyingQuestion: string
}

export interface OpenAIQuestionSummaryResponse {
    summary: string
}


export interface OpenAIThreadAnswersCompletenessResponse {
    completeness: number
}

export interface OpenAIAnamnesisQuestion {
    q: string
    type: string
}

export interface GenericQuestion {
    id: number
    q: string
    threadID: string
}

export interface AnamnesisQuestion extends GenericQuestion {
    type: AnamnesisQuestionType
    answerSummary: string
}

export enum AnamnesisQuestionType {
    ACCOMPANYING_SYMPTOMS,
    ONSET, // When the symptoms started
    LOCATION, // Where the patient feels the symptom
    DURATION, // How long the symptoms have been present
    CHARACTER, // The nature or type of the symptoms
    ALLEVIATING_AGGRAVATING, // What makes the symptoms better or worse
    SEVERITY, // The intensity of the symptoms
    HPI, // History of Present Illness: Brief narrative of the patient's current complaints
    SUBJECTIVE, // The patient’s description of the problem or condition
    SYMPTOMS,
    HISTORY,
    ALLERGIES,
    MEDS,
    SENSATIONS,
    TIMELINE,
    CHANGES,
    LIFESTYLE,
    HABITS,
    DIAGNOSTIC_TESTS,
    MENTAL_STATE,
    ENVIRONMENTAL,
    OTHER
}
