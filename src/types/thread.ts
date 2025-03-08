import { ChatMessage } from './chat-message.js';
import { Patient } from './patient.js';
import { PrescriptionThreadStage } from './prescriptions.js'

export type ThreadStageTypes = RegularComplaintThreadStage | PrescriptionThreadStage;

export interface ChatThread {
    id: string
    patientID: string
    title: string
    class: ThreadClass
    stage: ThreadStageTypes
    language: string
    createdAt: Date
}

export enum ThreadClass {
    DOCTOR_CONSULTATION = "DOCTOR_CONSULTATION",
    PRESCRIPTION_RELATED = "PRESCRIPTION_RELATED",
    SICK_LEAVE_RELATED = "SICK_LEAVE_RELATED",
    DOCTOR_REFERRAL_REQUEST = "DOCTOR_REFERRAL_REQUEST",

    LAB_TESTS_REQUEST = "LAB_TESTS_REQUEST",
    LAB_TESTS_EXPLANATIONS = "LAB_TESTS_EXPLANATIONS"
}

export enum QuickActionCode {
    // POPULAR (Category 1)
    DOCTOR_REFERRAL_REQUEST = 'DOCTOR_REFERRAL_REQUEST',
    LAB_TESTS_REQUEST = 'LAB_TESTS_REQUEST',
    PRESCRIPTION_RELATED = 'PRESCRIPTION_RELATED',
    SICK_LEAVE_RELATED = 'SICK_LEAVE_RELATED',
    BIRTH_CONTROL = 'BIRTH_CONTROL',

    // GENERAL_CONSULTATION (Category 2)
    FLU = 'FLU',
    TRAVEL_VACCINATIONS = 'TRAVEL_VACCINATIONS',

    // LAB_TESTS (Category 3)
    LAB_TESTS_EXPLANATIONS = 'LAB_TESTS_EXPLANATIONS',

    // SEXUAL_HEALTH (Category 4)
    PERIODS = 'PERIODS',
    EMERGENCY_BIRTH_CONTROL = 'EMERGENCY_BIRTH_CONTROL',
    BETTER_SEX = 'BETTER_SEX',
    SEXUAL_INFECTIONS = 'SEXUAL_INFECTIONS',
    HORMONE_BALANCE = 'HORMONE_BALANCE',

    // PEDIATRICS (Category 5)
    CHILD_VACCINE = 'CHILD_VACCINE',
    CHILD_FEVER = 'CHILD_FEVER',
    CHILD_RASH = 'CHILD_RASH',
    CHILD_BEHAVIOR = 'CHILD_BEHAVIOR',

    // WEIGHT_MANAGEMENT (Category 6)
    LOSE_WEIGHT = 'LOSE_WEIGHT',
    WEIGHT_GAIN = 'WEIGHT_GAIN',
    METABOLISM = 'METABOLISM',
    LIFESTYLE_CHANGE = 'LIFESTYLE_CHANGE',

    // MENTAL (Category 7)
    LESS_ANXIETY = 'LESS_ANXIETY',
    DEPRESSION = 'DEPRESSION',
    FEEL_HAPPY = 'FEEL_HAPPY',
    BETTER_SLEEP = 'BETTER_SLEEP',
    CALM_MIND = 'CALM_MIND',
    BURNOUT = 'BURNOUT',
    NICOTINE_ADDICTION = 'NICOTINE_ADDICTION',

    // SKIN_HAIR (Category 8)
    ACNE_CARE = 'ACNE_CARE',
    HAIR_REGROW = 'HAIR_REGROW',
    SKIN_RASH = 'SKIN_RASH',

    // DIGESTIVE (Category 9)
    BLOATING = 'BLOATING',
    CONSTIPATION = 'CONSTIPATION',
    STOMACH_COMFORT = 'STOMACH_COMFORT',

    // ORTHOPEDICS (Category 10)
    JOINT_PAIN = 'JOINT_PAIN',
    BACK_PAIN = 'BACK_PAIN',
    NECK_PAIN = 'NECK_PAIN',
    SPORTS_INJURY = 'SPORTS_INJURY',

    // ALLERGY (Category 11)
    POLLEN_ALLERGY = 'POLLEN_ALLERGY',
    FOOD_ALLERGY = 'FOOD_ALLERGY',
    SKIN_ALLERGY = 'SKIN_ALLERGY',
    PET_ALLERGY = 'PET_ALLERGY',

    // ENDOCRINOLOGY (Category 12)
    DIABETES_MGMT = 'DIABETES_MGMT',
    INSULIN_RESISTANCE = 'INSULIN_RESISTANCE',
    THYROID_DISEASES = 'THYROID_DISEASES',
    OBESITY_METABOLIC = 'OBESITY_METABOLIC',

    // Common across multiple categories
    OTHER_QUESTION = 'OTHER_QUESTION'
}


export enum RegularComplaintThreadStage {
    Initiation = "Initiation",
    Problem_Statement = "Problem_Statement", //COVERED
    Assessment = "Assessment", //COVERED
    Questions_To_Doctor = "Questions_To_Doctor", //COVERED
    Payment = "Payment",
    Ready_For_Doctor = "Ready_For_Doctor",
    Treatment_Plan = "Treatment_Plan", //now when doctor joins the thread
    Diagnosis = "Diagnosis", // when doctor sends the outcome
    Treatment_Discussion = "Treatment_Discussion", //when patient sends any questions
    Closure = "Closure", //when patient confirms the end of the thread
    Follow_Up = "Follow_Up", //when patient is providing follow up information after some time,
    Feedback = "Feedback",
}

export const stageEqualOrComesAfter = (stage1: RegularComplaintThreadStage, stage2: RegularComplaintThreadStage): boolean => {
    const order = Object.values(RegularComplaintThreadStage);
    return order.indexOf(stage1) >= order.indexOf(stage2);
}

export const stageComesAfter = (stage1: RegularComplaintThreadStage, stage2: RegularComplaintThreadStage): boolean => {
    const order = Object.values(RegularComplaintThreadStage);
    return order.indexOf(stage1) > order.indexOf(stage2);
}

export interface GenericReply {
    message: string
}

export interface GreetingsReply extends GenericReply {
}

export interface NoOfftopicReply extends GenericReply {
}

export interface EllaborateReply extends GenericReply {
}

export interface SummarizeCompaint extends GenericReply {
}

export interface TenantConfiguation {
    paymentEnabled: boolean
}

export interface ThreadContext {
    threadID: string
    patientID: string
    tenantID: number
    language: string
    patient: Patient
    tenantConfiguration: TenantConfiguation
    creationContext?: ThreadCreationContext
}

export interface ThreadCreationContext {
    conditionId?: number;
    quickAction?: QuickActionCode
}

export interface ChangeInThreadEvent {
    type: "UPDATE" | "DELETE"
    threadID: string
    patientID?: string
    doctorID?: string
    thread: ChatThread
}

export interface ChangeInMessageEvent {
    type: "UPDATE" | "DELETE"
    threadID: string
    messageID: number
    patientID?: string
    doctorID?: string
    message: ChatMessage
}