import { BasicThreadRequest } from "./chat-definitions.js"
import { ChatMessageRequest } from "./chat-message.js"
import { Summary, Symptom, TreatmentPlan } from "./chat-review.js"
import { ChatThread } from "./thread.js"

export interface Doctor {
    id: string
    name: string
    tenantId: number
    firstName: string
    lastName: string
    email: string
    languagesSpoken: string[]
    photoURL: string
}

export interface Prescription {
    id?: number;
    localThreadId: number;
    medicationName: string;
    medicationAtcCode: string;
    doseQuantity: number;
    dosageUnit: DosageUnit;
    frequency: Frequency;
    periodUnit?: string; // New field for frequency unit (e.g., "h", "d")
    periodValue?: number; // New field for frequency value (e.g., "8")
    duration: number;
    specialInstructions: string;
    createdAt?: Date;
}


export interface ConfirmedPrescription extends Prescription {
    gtin: string
    updatedAt?: Date;
    upatedBy: string;
    numberOfPackages: number;
}

export interface ConfirmedPrescriptionWithMeds extends ConfirmedPrescription {
    searchResult: ShrankMedicinalProduct[];
}

enum DosageUnit {
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

enum Frequency {
    ONCE_DAILY = "ONCE_DAILY",
    TWICE_DAILY = "TWICE_DAILY",
    THREE_TIMES_DAILY = "THREE_TIMES_DAILY",
    FOUR_TIMES_DAILY = "FOUR_TIMES_DAILY",
    AS_DESCRIBED = "AS_DESCRIBED"
}

interface ShrankMedicinalProduct {
    id: string;
    medicinalProductName: string;
    commonName: string;
    medicinalProductPower: string;
    pharmaceuticalFormName: string;
    activeSubstanceName: string;
    atcCode: string;
    productVariations: ShrankMedicinalProductVariations[];
}

interface ShrankMedicinalProductVariations {
    packaging: string;
    gtin: string
    accessibilityCategory: string;
}

export interface SickLeave {
    id?: number;
    localThreadId: number;
    startDate: Date;
    endDate: Date;
    icdCode: string;
    nip: string;
    details: string;
    insurance: string;
    createdAt?: Date;
}

export interface ConfirmedSickLeave extends SickLeave {
    updatedBy: string;
    updatedAt?: Date;
}

export interface AdditionalTest {
    id?: number;
    localThreadId: number;
    name: string;
    loincCode: string;
    reason: string;
    createdAt?: Date;
}

export interface Examination {
    id?: number;
    localThreadId: number;
    name: string;
    cptCode: string;
    purpose: string;
    createdAt?: Date;
}

export interface DoctorThreadData {
    summary: Summary | null;
    confirmedSymptoms: Symptom[];
    confirmedDiagnoses: Diagnosis[];
    confirmedTreatmentPlan: TreatmentPlan | null;
    confirmedPrescriptions: ConfirmedPrescriptionWithMeds[];
    confirmedSickLeaves: SickLeave[];
    confirmedAdditionalTests: AdditionalTest[];
    confirmedExaminations: Examination[];
}


export interface Diagnosis {
    id?: number;
    localThreadId: number;
    diagnosis: string;
    probability: number;
    icdCode: string;
    createdAt?: Date;
}

export interface ICDCodeSearchResult {
    id: number;
    code: string;
    en: string;
    pl: string;
    ua: string;
    ru: string;
    de: string;
    level: number;
    hash: string;
    creation_date: Date;
}

export interface DiagnosisWithICDCodes extends Diagnosis, Partial<ICDCodeSearchResult> {}
export interface SymptomWithICDCodes extends Symptom, Partial<ICDCodeSearchResult> {}

export interface DoctorContext {
    doctorID: string
    threadID: string
    tenantID: number
    language: string
}

export interface NewDoctorThreadMessageRequest extends BasicThreadRequest {
    message: ChatMessageRequest
}

export interface ThreadJoinedResponse {
    thread: ChatThread
}

export interface ThreadResolvedResponse {
    thread: ChatThread
}

export interface ThreadFileSummary {
    shortSummary: string;
    stage: string;
    uuid?: string;
    threadID: string;
}

export interface DoctorReviewUpdate {
    context: Partial<DoctorContext>
    stage: number
}
