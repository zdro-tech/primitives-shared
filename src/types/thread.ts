import { ChatMessage } from './chat-message.js';
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
    DOCTOR_CONSULTATION,
    PRESCRIPTION_RELATED,
    SICK_LEAVE_RELATED,
    TESTS_INTERPRETATION,
    APPOINTMENT_SCHEDULING,
    OTHER_QUESTIONS
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
    Follow_Up = "Follow_Up" //when patient is providing follow up information after some time
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

export interface Context {
    threadID: string
    patientID: string
    tenantID: number
    language: string
    patient: Patient
    tenantConfiguration: TenantConfiguation
}

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
    signUpLanguage: string;
    createdAt: Date;
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