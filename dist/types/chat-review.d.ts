import { AdditionalTest, Examination, SickLeave } from "./doctor.js";
import { ThreadContext } from "./thread.js";
export interface ConfirmedAdditionalTest extends AdditionalTest {
    updatedBy: string;
    updatedAt?: Date;
}
export interface ConfirmedExamination extends Examination {
    updatedBy: string;
    updatedAt?: Date;
}
export interface LocalThread {
    id: number;
    thread_id: string;
    patient_id: string;
    tenant_id: number;
    language: string;
}
export declare enum DosageUnit {
    mg = "mg",
    g = "g",
    IU = "IU",
    ml = "ml",
    drops = "drops",
    capsules = "capsules",
    tablets = "tablets",
    puffs = "puffs",
    patches = "patches",
    units = "units",
    teaspoons = "teaspoons",
    tablespoons = "tablespoons",
    ounces = "ounces"
}
export declare enum Frequency {
    ONCE_DAILY = "ONCE_DAILY",
    TWICE_DAILY = "TWICE_DAILY",
    THREE_TIMES_DAILY = "THREE_TIMES_DAILY",
    FOUR_TIMES_DAILY = "FOUR_TIMES_DAILY",
    AS_DESCRIBED = "AS_DESCRIBED"
}
export interface RecommendedSickLeave extends SickLeave {
    updatedBy: string;
    updatedAt?: Date;
}
export interface Summary {
    id?: number;
    localThreadId: number;
    summary: string;
    createdAt?: Date;
}
export interface Symptom {
    id?: number;
    localThreadId: number;
    symptom: string;
    icdCode: string;
    createdAt?: Date;
}
export interface TreatmentPlan {
    id: number;
    localThreadId: number;
    treatmentDescription: string;
    createdAt: Date;
}
export interface ConfirmedTreatmentPlan extends TreatmentPlan {
    updatedBy: string;
    updatedAt?: Date;
}
export interface ChatReviewEvent {
    context: ThreadContext;
    stage: number;
}
export interface OpenAIPatientSymptoms {
    symptoms: OpenAIPatientSymptom[];
}
export interface OpenAIPatientSymptom {
    symptom: string;
    icd10Code: string;
}
export interface OpenAISummary {
    summary: string;
}
export interface OpenAIDiagnosis {
    diagnosis: string;
    probability: number;
    icd10Code: string;
}
export interface OpenAIDifferentialDiagnoses {
    diagnoses: OpenAIDiagnosis[];
}
export interface OpenAITreatmentPlan {
    plan: string;
}
export interface OpenAIPrescriptions {
    prescriptions: Array<OpenAIPrescription>;
}
export interface OpenAIPrescription {
    medicationName: string;
    medicationAtcCode: string;
    activeSubstanceUnit: string;
    activeSubstanceQuantity: number;
    doseQuantity: number;
    periodUnit: string;
    periodValue: number;
    numberOfPackages: number;
    specialInstructions: string;
}
export interface OpenAISickLeaveResponse {
    sickLeave: OpenAISickLeave;
}
export interface OpenAISickLeave {
    duration: number;
    followUpDetails: string;
}
export interface OpenAIAdditionalExaminations {
    additionalExaminations: OpenAIAdditionalExamination[];
}
export interface OpenAIAdditionalTests {
    additionalTests: OpenAIAdditionalTest[];
}
export interface OpenAIAdditionalExamination {
    name: string;
    purpose: string;
    cptCode: string;
}
export interface OpenAIAdditionalTest {
    name: string;
    reason: string;
    loincCode: string;
}
export interface ThreadFile {
    id: number;
    threadId: string;
    originalName: string;
    uuid: string;
    bucketFileName: string;
}
export declare enum FileProcessingStage {
    UPLOADED = 0,// file is uploaded to the bucket and ready to be analyzed
    IN_PROCESSING = 1,// file is in the queue or currently being processed
    ANALYZED = 2,// file is analyzed and saved
    ANALYZE_ERROR = 3,// error while analyzing the file
    SKIPPED = 4
}
export interface AnalyzedFileSummaryResponse {
    internalUuid: string;
    responseCode: string;
    summary: string;
}
//# sourceMappingURL=chat-review.d.ts.map