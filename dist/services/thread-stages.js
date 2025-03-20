import { FreemiumThreadStage, RegularComplaintThreadStage, ThreadClass } from "../types/thread.js";
//Threads by type
export const NORMAL_PAID_THREADS = [ThreadClass.DOCTOR_CONSULTATION, ThreadClass.SICK_LEAVE_RELATED,
    ThreadClass.PRESCRIPTION_RELATED, ThreadClass.VACCINATION_REQUEST,
    ThreadClass.DOCTOR_REFERRAL_REQUEST];
export const FREEMIUM_THREADS = [ThreadClass.LAB_TESTS_EXPLANATIONS, ThreadClass.LAB_TESTS_REQUEST];
export const NORMAL_PAID_THREADS_NOT_YET_PAID = [RegularComplaintThreadStage.Initiation,
    RegularComplaintThreadStage.Problem_Statement,
    RegularComplaintThreadStage.Assessment,
    RegularComplaintThreadStage.Questions_To_Doctor,
    RegularComplaintThreadStage.Payment];
export const FREEMIUM_THREADS_NOT_YET_PAID = [
    FreemiumThreadStage.Initiation, FreemiumThreadStage.Problem_Statement,
    FreemiumThreadStage.Assessment, FreemiumThreadStage.Select_Payment_Option,
    FreemiumThreadStage.Payment, FreemiumThreadStage.Ready_For_Automatic_Review,
    FreemiumThreadStage.Automatic_Diagnosis, FreemiumThreadStage.Automatic_Treatment_Discussion,
];
export const NORMAL_PAID_THREADS_OUTCOME_IS_READY = [RegularComplaintThreadStage.Diagnosis, RegularComplaintThreadStage.Treatment_Discussion,
    RegularComplaintThreadStage.Closure, RegularComplaintThreadStage.Follow_Up];
export const FREEMIUM_THREADS_OUTCOME_IS_READY = [FreemiumThreadStage.Diagnosis, FreemiumThreadStage.Treatment_Discussion,
    FreemiumThreadStage.Closure, FreemiumThreadStage.Follow_Up,
    FreemiumThreadStage.Automatic_Diagnosis, FreemiumThreadStage.Automatic_Treatment_Discussion];
export const NORMAL_PAID_THREADS_DOCTOR_JOINED = [...[RegularComplaintThreadStage.Treatment_Plan], ...NORMAL_PAID_THREADS_OUTCOME_IS_READY];
export const FREEMIUM_THREADS_DOCTOR_JOINED = FREEMIUM_THREADS_OUTCOME_IS_READY;
export const NORMAL_PAID_THREADS_PAID = [...[RegularComplaintThreadStage.Ready_For_Doctor, RegularComplaintThreadStage.Treatment_Plan], ...NORMAL_PAID_THREADS_OUTCOME_IS_READY];
export const FREEMIUM_THREADS_PAID = [...[FreemiumThreadStage.Ready_For_Doctor, FreemiumThreadStage.Treatment_Plan], ...FREEMIUM_THREADS_OUTCOME_IS_READY];
export const isThreadFreemium = (clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (FREEMIUM_THREADS.includes(clasz)) {
        return true;
    }
    return false;
};
export const isThreadOutcomeReady = (stage, clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return NORMAL_PAID_THREADS_OUTCOME_IS_READY.includes(stage);
    }
    return FREEMIUM_THREADS_OUTCOME_IS_READY.includes(stage);
};
export const hasDoctorJoinedTheThread = (stage, clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return NORMAL_PAID_THREADS_DOCTOR_JOINED.includes(stage);
    }
    return FREEMIUM_THREADS_DOCTOR_JOINED.includes(stage);
};
export const canCloseTheThread = (stage, clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return ![RegularComplaintThreadStage.Closure].includes(stage);
    }
    return ![FreemiumThreadStage.Closure].includes(stage);
};
export const isThreadClosed = (stage, clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return [RegularComplaintThreadStage.Closure].includes(stage);
    }
    return [FreemiumThreadStage.Closure].includes(stage);
};
export const isThreadInPaymentMode = (stage, clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return [RegularComplaintThreadStage.Payment].includes(stage);
    }
    return [FreemiumThreadStage.Payment].includes(stage);
};
export const isThreadPaid = (stage, clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return NORMAL_PAID_THREADS_PAID.includes(stage);
    }
    return FREEMIUM_THREADS_PAID.includes(stage);
};
export const getInitiationStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Initiation
    : FreemiumThreadStage.Initiation;
export const getProblemStatementStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Problem_Statement
    : FreemiumThreadStage.Problem_Statement;
export const getAssessmentStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Assessment
    : FreemiumThreadStage.Assessment;
// Only applicable for regular threads.
export const getQuestionsToDoctorStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Questions_To_Doctor
    : undefined;
export const getPaymentStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Payment
    : FreemiumThreadStage.Select_Payment_Option;
export const getReadyForDoctorStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Ready_For_Doctor
    : FreemiumThreadStage.Ready_For_Doctor;
export const getTreatmentPlanStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Treatment_Plan
    : FreemiumThreadStage.Treatment_Plan;
export const getOutcomeIsReadyStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Diagnosis
    : FreemiumThreadStage.Automatic_Diagnosis;
export const getTreatmentDiscussionStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Treatment_Discussion
    : FreemiumThreadStage.Automatic_Treatment_Discussion;
export const getClosureStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Closure
    : FreemiumThreadStage.Closure;
export const getFollowUpStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Follow_Up
    : FreemiumThreadStage.Follow_Up;
export const getFeedbackStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => NORMAL_PAID_THREADS.includes(clasz)
    ? RegularComplaintThreadStage.Feedback
    : FreemiumThreadStage.Feedback;
export const getReadyForAutomaticReviewStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        throw new Error("Ready_For_Automatic_Review stage is not available for regular paid threads.");
    }
    return FreemiumThreadStage.Ready_For_Automatic_Review;
};
export const getAutomaticDiagnosisStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        throw new Error("Automatic_Diagnosis stage is not available for regular paid threads.");
    }
    return FreemiumThreadStage.Automatic_Diagnosis;
};
export const getAutomaticTreatmentDiscussionStage = (clasz = ThreadClass.DOCTOR_CONSULTATION) => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        throw new Error("Automatic_Treatment_Discussion stage is not available for regular paid threads.");
    }
    return FreemiumThreadStage.Automatic_Treatment_Discussion;
};
