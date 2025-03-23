import { FreemiumThreadStage, RegularComplaintThreadStage, ThreadClass, ThreadStageType } from "../types/thread.js";
export declare const NORMAL_PAID_THREADS: ThreadClass[];
export declare const FREEMIUM_THREADS: ThreadClass[];
export declare const NORMAL_PAID_THREADS_NOT_YET_PAID: RegularComplaintThreadStage[];
export declare const FREEMIUM_THREADS_NOT_YET_PAID: FreemiumThreadStage[];
export declare const NORMAL_PAID_THREADS_OUTCOME_IS_READY: RegularComplaintThreadStage[];
export declare const FREEMIUM_THREADS_OUTCOME_IS_READY: FreemiumThreadStage[];
export declare const NORMAL_PAID_THREADS_DOCTOR_JOINED: RegularComplaintThreadStage[];
export declare const FREEMIUM_THREADS_DOCTOR_JOINED: FreemiumThreadStage[];
export declare const NORMAL_PAID_THREADS_PAID: RegularComplaintThreadStage[];
export declare const FREEMIUM_THREADS_PAID: FreemiumThreadStage[];
export declare const isThreadFreemium: (clasz?: ThreadClass) => boolean;
export declare const isThreadOutcomeReady: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const hasDoctorJoinedTheThread: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const canCloseTheThread: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const isThreadClosed: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const isThreadInPaymentMode: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const isThreadPaid: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const getInitiationStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getProblemStatementStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getAssessmentStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getQuestionsToDoctorStage: (clasz?: ThreadClass) => ThreadStageType | undefined;
export declare const getPaymentStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getReadyForDoctorStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getTreatmentPlanStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getOutcomeIsReadyStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getTreatmentDiscussionStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getClosureStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getFollowUpStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getReadyForAutomaticReviewStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getAutomaticDiagnosisStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const getAutomaticTreatmentDiscussionStage: (clasz?: ThreadClass) => ThreadStageType;
//# sourceMappingURL=thread-stages.d.ts.map