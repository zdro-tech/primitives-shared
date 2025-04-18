import { GenericQuestion } from "./anamnesis.js";
import { ThreadClass } from "./thread.js";

export interface MessageAnalysisResponse {
    healthQuestions: boolean;
    lifeThreatening: boolean;
    child: boolean;
    human: boolean;
    gratitude: boolean;
    offtopic: boolean;
    joke: boolean;
}

export interface ChatClassifictionResponse {
    intent?: string
}

export interface ChatClassifiction {
    intent?: ThreadClass
    clarifyingQuestion?: string
}

export interface OpenAIThreadSummaryResponse {
    title: string
}

export interface ThreadSummaryResponse {
    title: string
}

export interface ExtractedQuestionsResponse {
    questions: Array<PatientQuestion>
    remainingText: string
}

export interface PatientQuestion extends GenericQuestion {

}

export interface ExtractedQuestionsResponse {
    questions: Array<PatientQuestion>
    remainingText: string
}


export interface ProposedAnswersResponse {
    options: Array<string>
}