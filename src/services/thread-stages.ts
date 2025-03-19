import { FreemiumThreadStage, RegularComplaintThreadStage, ThreadClass, ThreadStageType } from "../types/thread.js"

const NORMAL_PAID_THREADS = [ThreadClass.DOCTOR_CONSULTATION, ThreadClass.SICK_LEAVE_RELATED,
ThreadClass.PRESCRIPTION_RELATED, ThreadClass.VACCINATION_REQUEST,
ThreadClass.DOCTOR_REFERRAL_REQUEST]
const FREEMIUM_THREADS = [ThreadClass.LAB_TESTS_EXPLANATIONS, ThreadClass.LAB_TESTS_REQUEST]

const NORMAL_PAID_THREADS_OUTCOME_IS_READY = [RegularComplaintThreadStage.Diagnosis, RegularComplaintThreadStage.Treatment_Discussion,
RegularComplaintThreadStage.Closure, RegularComplaintThreadStage.Follow_Up]
const FREEMIUM_THREADS_OUTCOME_IS_READY = [FreemiumThreadStage.Diagnosis, FreemiumThreadStage.Treatment_Discussion,
FreemiumThreadStage.Closure, FreemiumThreadStage.Follow_Up,
FreemiumThreadStage.Automatic_Diagnosis, FreemiumThreadStage.Automatic_Treatment_Discussion]

const NORMAL_PAID_THREADS_DOCTOR_JOINED = [...[RegularComplaintThreadStage.Treatment_Plan], ...NORMAL_PAID_THREADS_OUTCOME_IS_READY]
const FREEMIUM_THREADS_DOCTOR_JOINED = FREEMIUM_THREADS_OUTCOME_IS_READY

const NORMAL_PAID_THREADS_PAID = [...[RegularComplaintThreadStage.Ready_For_Doctor, RegularComplaintThreadStage.Treatment_Plan], ...NORMAL_PAID_THREADS_OUTCOME_IS_READY]
const FREEMIUM_THREADS_PAID = [...[FreemiumThreadStage.Ready_For_Doctor, FreemiumThreadStage.Treatment_Plan], ...FREEMIUM_THREADS_OUTCOME_IS_READY]

export const isThreadOutcomeReady = (stage: ThreadStageType, clasz = ThreadClass.DOCTOR_CONSULTATION): boolean => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return NORMAL_PAID_THREADS_OUTCOME_IS_READY.includes(stage)
    }
    return FREEMIUM_THREADS_OUTCOME_IS_READY.includes(stage)
}

export const getOutcomeIsReadyStage = (clasz = ThreadClass.DOCTOR_CONSULTATION): ThreadStageType => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return RegularComplaintThreadStage.Diagnosis
    }
    return FreemiumThreadStage.Automatic_Diagnosis
}

export const hasDoctorJoinedTheThread = (stage: ThreadStageType, clasz = ThreadClass.DOCTOR_CONSULTATION): boolean => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return NORMAL_PAID_THREADS_DOCTOR_JOINED.includes(stage)
    }
    return FREEMIUM_THREADS_DOCTOR_JOINED.includes(stage)
}

export const canCloseTheThread = (stage: ThreadStageType, clasz = ThreadClass.DOCTOR_CONSULTATION): boolean => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return ![RegularComplaintThreadStage.Closure].includes(stage)
    }
    return ![FreemiumThreadStage.Closure].includes(stage)
}

export const isThreadClosed = (stage: ThreadStageType, clasz = ThreadClass.DOCTOR_CONSULTATION): boolean => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return [RegularComplaintThreadStage.Closure].includes(stage)
    }
    return [FreemiumThreadStage.Closure].includes(stage)
}

export const isThreadInPaymentMode = (stage: ThreadStageType, clasz = ThreadClass.DOCTOR_CONSULTATION): boolean => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return [RegularComplaintThreadStage.Payment].includes(stage)
    }
    return [FreemiumThreadStage.Payment].includes(stage)
}

export const isThreadPaid = (stage: ThreadStageType, clasz = ThreadClass.DOCTOR_CONSULTATION): boolean => {
    if (NORMAL_PAID_THREADS.includes(clasz)) {
        return NORMAL_PAID_THREADS_PAID.includes(stage)
    }
    return FREEMIUM_THREADS_PAID.includes(stage)
}

