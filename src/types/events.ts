import { ChatMessage, ChatThread, Context, DoctorContext, Patient, ProposedAnswersResponse, ThreadClass } from "./index.js"

export interface OutgoingMessageEvent {
    context: Context
    payload: ChatMessage
    callback?: Callback
}

export interface OutgoingSavedMessageEvent {
  context: Context
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
    context: Context,
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
  }

  export interface PatientReplySuggestionsEvent {
    context: Context
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
    authCode: string;
    language: string;
}

export interface ThreadUpdateVariables {
  threadID: string;
}