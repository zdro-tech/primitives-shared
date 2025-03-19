import { ThreadClass, ThreadStageType } from "../types/thread.js";
export declare const isThreadOutcomeReady: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const getOutcomeIsReadyStage: (clasz?: ThreadClass) => ThreadStageType;
export declare const hasDoctorJoinedTheThread: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const canCloseTheThread: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const isThreadClosed: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const isThreadInPaymentMode: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
export declare const isThreadPaid: (stage: ThreadStageType, clasz?: ThreadClass) => boolean;
//# sourceMappingURL=thread-stages.d.ts.map