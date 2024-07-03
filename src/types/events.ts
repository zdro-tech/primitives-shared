import { ChatMessage, ChatThread, Context, Patient, ProposedAnswersResponse, ThreadClass } from "./index.js"

export interface OutgoingMessageEvent {
    context: Context
    payload: ChatMessage
    callback?: Callback
}

export interface Callback {
    forwardBack: any
}


export interface OutgoingtMesssageConfirmationEvent {
    message: ChatMessage,
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