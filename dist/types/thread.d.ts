import { ChatMessage } from './chat-message.js';
import { Patient } from './patient.js';
export type ThreadStageType = RegularComplaintThreadStage | PrescriptionThreadStage | SickLeaveThreadStage | VaccinationThreadStage | LabTestsThreadStage | LabTestsExplanationsThreadStage;
export interface ChatThread {
    id: string;
    patientID: string;
    title: string;
    class: ThreadClass;
    stage: ThreadStageType;
    language: string;
    quickAction: QuickActionCode;
    createdAt: Date;
}
export declare enum ThreadClass {
    DOCTOR_CONSULTATION = "DOCTOR_CONSULTATION",
    PRESCRIPTION_RELATED = "PRESCRIPTION_RELATED",
    SICK_LEAVE_RELATED = "SICK_LEAVE_RELATED",
    DOCTOR_REFERRAL_REQUEST = "DOCTOR_REFERRAL_REQUEST",
    VACCINATION_REQUEST = "VACCINATION_REQUEST",
    LAB_TESTS_REQUEST = "LAB_TESTS_REQUEST",
    LAB_TESTS_EXPLANATIONS = "LAB_TESTS_EXPLANATIONS"
}
export declare enum QuickActionCode {
    DOCTOR_REFERRAL_REQUEST = "DOCTOR_REFERRAL_REQUEST",
    LAB_TESTS_REQUEST = "LAB_TESTS_REQUEST",
    PRESCRIPTION_RELATED = "PRESCRIPTION_RELATED",
    SICK_LEAVE_RELATED = "SICK_LEAVE_RELATED",
    BIRTH_CONTROL = "BIRTH_CONTROL",
    VACCINATION_REQUEST = "VACCINATION_REQUEST",
    FLU = "FLU",
    VACCINATIONS = "VACCINATIONS",
    TRAVEL_VACCINATIONS = "TRAVEL_VACCINATIONS",
    LAB_TESTS_EXPLANATIONS = "LAB_TESTS_EXPLANATIONS",
    PERIODS = "PERIODS",
    EMERGENCY_BIRTH_CONTROL = "EMERGENCY_BIRTH_CONTROL",
    BETTER_SEX = "BETTER_SEX",
    SEXUAL_INFECTIONS = "SEXUAL_INFECTIONS",
    HORMONE_BALANCE = "HORMONE_BALANCE",
    CHILD_VACCINE = "CHILD_VACCINE",
    CHILD_FEVER = "CHILD_FEVER",
    CHILD_RASH = "CHILD_RASH",
    CHILD_SLEEP = "CHILD_SLEEP",
    CHILD_BEHAVIOR = "CHILD_BEHAVIOR",
    LOSE_WEIGHT = "LOSE_WEIGHT",
    WEIGHT_GAIN = "WEIGHT_GAIN",
    METABOLISM = "METABOLISM",
    LIFESTYLE_CHANGE = "LIFESTYLE_CHANGE",
    LESS_ANXIETY = "LESS_ANXIETY",
    DEPRESSION = "DEPRESSION",
    FEEL_HAPPY = "FEEL_HAPPY",
    BETTER_SLEEP = "BETTER_SLEEP",
    STRESS_REDUCTION = "STRESS_REDUCTION",
    BURNOUT = "BURNOUT",
    NICOTINE_ADDICTION = "NICOTINE_ADDICTION",
    ACNE_CARE = "ACNE_CARE",
    HAIR_REGROW = "HAIR_REGROW",
    SKIN_RASH = "SKIN_RASH",
    DERMATITIS = "DERMATITIS",
    PSORIASIS = "PSORIASIS",
    SKIN_INFECTIONS = "SKIN_INFECTIONS",
    BLOATING = "BLOATING",
    CONSTIPATION = "CONSTIPATION",
    STOMACH_COMFORT = "STOMACH_COMFORT",
    JOINT_PAIN = "JOINT_PAIN",
    BACK_PAIN = "BACK_PAIN",
    NECK_PAIN = "NECK_PAIN",
    INJURY = "INJURY",
    POLLEN_ALLERGY = "POLLEN_ALLERGY",
    FOOD_ALLERGY = "FOOD_ALLERGY",
    SKIN_ALLERGY = "SKIN_ALLERGY",
    PET_ALLERGY = "PET_ALLERGY",
    DIABETES_MGMT = "DIABETES_MGMT",
    INSULIN_RESISTANCE = "INSULIN_RESISTANCE",
    THYROID_DISEASES = "THYROID_DISEASES",
    OBESITY_METABOLIC = "OBESITY_METABOLIC",
    OTHER_QUESTION = "OTHER_QUESTION"
}
export declare enum RegularComplaintThreadStage {
    Initiation = "Initiation",
    Problem_Statement = "Problem_Statement",//COVERED
    Assessment = "Assessment",//COVERED
    Questions_To_Doctor = "Questions_To_Doctor",//COVERED
    Payment = "Payment",
    Ready_For_Doctor = "Ready_For_Doctor",
    Treatment_Plan = "Treatment_Plan",//now when doctor joins the thread
    Diagnosis = "Diagnosis",// when doctor sends the outcome
    Treatment_Discussion = "Treatment_Discussion",//when patient sends any questions
    Closure = "Closure",//when patient confirms the end of the thread
    Follow_Up = "Follow_Up",//when patient is providing follow up information after some time,
    Feedback = "Feedback"
}
export type PrescriptionThreadStage = RegularComplaintThreadStage;
export type SickLeaveThreadStage = RegularComplaintThreadStage;
export type VaccinationThreadStage = RegularComplaintThreadStage;
export type DoctorReferralThreadStage = RegularComplaintThreadStage;
export declare enum LabTestsThreadStage {
    Initiation = "Initiation",
    Problem_Statement = "Problem_Statement",
    Assessment = "Assessment",
    Select_Payment_Option = "Select_Payment_Option",
    Payment = "Payment",
    Ready_For_Doctor = "Ready_For_Doctor",
    Treatment_Plan = "Treatment_Plan",
    Diagnosis = "Diagnosis",
    Treatment_Discussion = "Treatment_Discussion",
    Ready_For_Automatic_Review = "Ready_For_Automatic_Review",
    Treatment_Automatic_Discussion = "Treatment_Discussion",
    Closure = "Closure",
    Follow_Up = "Follow_Up",
    Feedback = "Feedback"
}
export type LabTestsExplanationsThreadStage = RegularComplaintThreadStage;
export declare const regularComplaintStageEqualOrComesAfter: (stage1: RegularComplaintThreadStage, stage2: RegularComplaintThreadStage) => boolean;
export declare const regularComplaintStageComesAfter: (stage1: RegularComplaintThreadStage, stage2: RegularComplaintThreadStage) => boolean;
export interface GenericReply {
    message: string;
}
export interface TenantConfiguation {
    paymentEnabled: boolean;
}
export interface ThreadContext {
    threadID: string;
    patientID: string;
    tenantID: number;
    language: string;
    patient: Patient;
    tenantConfiguration: TenantConfiguation;
    creationContext?: ThreadCreationContext;
}
export interface ThreadCreationContext {
    conditionId?: number;
    quickAction?: QuickActionCode;
}
export interface ChangeInThreadEvent {
    type: "UPDATE" | "DELETE";
    threadID: string;
    patientID?: string;
    doctorID?: string;
    thread: ChatThread;
}
export interface ChangeInMessageEvent {
    type: "UPDATE" | "DELETE";
    threadID: string;
    messageID: number;
    patientID?: string;
    doctorID?: string;
    message: ChatMessage;
}
//# sourceMappingURL=thread.d.ts.map