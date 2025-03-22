import { ChatMessage, ChatThread, ThreadContext, DoctorContext, FileData, ProposedAnswersResponse, ThreadClass } from "./index.js"
import { Patient } from "./patient.js"

export interface OutgoingMessageEvent {
  context: ThreadContext
  payload: ChatMessage
  callback?: Callback
}

export interface OutgoingSavedMessageEvent {
  context: ThreadContext
  payload: ChatMessage
  callback?: Callback
}

export interface OutgoingDoctorMessageEvent {
  context: DoctorContext
  payload: ChatMessage
  callback?: Callback
}

export interface OutgoingSavedDoctorMessageEvent {
  context: DoctorContext
  payload: ChatMessage
  callback?: Callback
}

export interface Callback {
  forwardBack: any
}

export interface PatientMesssageEvent {
  context: ThreadContext,
  message: ChatMessage,
  messages: ChatMessage[],
  thread: ChatThread,
  patient: Patient
  enriched?: Enriched
}

export interface Enriched {
  title?: string
  intent?: ThreadClass
  clarifyingQuestion?: string

  healthQuestions: boolean;
  lifeThreatening: boolean;
  child: boolean;
  human: boolean;
  gratitude: boolean;
  offtopic: boolean;
  tooShort: boolean;
  joke: boolean;

  files?: FileData[]
}

export interface PatientReplySuggestionsEvent {
  context: ThreadContext
  payload: ProposedAnswersResponse
}

export interface EmailNotificationEvent<T> {
  emailType: 'patient-unread-message' | 'doctor-unread-message' | 'patient-sign-in-code';
  initiatorID?: string;
  variables?: T;
  serviceID?: string;
}

export interface SignInAuthCodeVariables {
  email: string;
  sub: string;
  authCode: string;
  language: string;
}

export interface ThreadUpdateVariables {
  threadID: string;
}

export interface PatientSignedUpEvent {
  id: string
  email: string
  tenantId: number
}