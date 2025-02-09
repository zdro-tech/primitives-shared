export var ThreadClass;
(function (ThreadClass) {
    ThreadClass["DOCTOR_CONSULTATION"] = "DOCTOR_CONSULTATION";
    ThreadClass["PRESCRIPTION_RELATED"] = "PRESCRIPTION_RELATED";
    ThreadClass["SICK_LEAVE_RELATED"] = "SICK_LEAVE_RELATED";
    ThreadClass["DOCTOR_REFERRAL_REQUEST"] = "DOCTOR_REFERRAL_REQUEST";
    ThreadClass["LAB_TESTS_REQUEST"] = "LAB_TESTS_REQUEST";
    ThreadClass["LAB_TESTS_EXPLANATIONS"] = "LAB_TESTS_EXPLANATIONS";
    ThreadClass["INTENT_IS_NOT_CLEAR"] = "INTENT_IS_NOT_CLEAR";
})(ThreadClass || (ThreadClass = {}));
export var RegularComplaintThreadStage;
(function (RegularComplaintThreadStage) {
    RegularComplaintThreadStage["Initiation"] = "Initiation";
    RegularComplaintThreadStage["Problem_Statement"] = "Problem_Statement";
    RegularComplaintThreadStage["Assessment"] = "Assessment";
    RegularComplaintThreadStage["Questions_To_Doctor"] = "Questions_To_Doctor";
    RegularComplaintThreadStage["Payment"] = "Payment";
    RegularComplaintThreadStage["Ready_For_Doctor"] = "Ready_For_Doctor";
    RegularComplaintThreadStage["Treatment_Plan"] = "Treatment_Plan";
    RegularComplaintThreadStage["Diagnosis"] = "Diagnosis";
    RegularComplaintThreadStage["Treatment_Discussion"] = "Treatment_Discussion";
    RegularComplaintThreadStage["Closure"] = "Closure";
    RegularComplaintThreadStage["Follow_Up"] = "Follow_Up";
    RegularComplaintThreadStage["Feedback"] = "Feedback";
})(RegularComplaintThreadStage || (RegularComplaintThreadStage = {}));
export const stageEqualOrComesAfter = (stage1, stage2) => {
    const order = Object.values(RegularComplaintThreadStage);
    return order.indexOf(stage1) >= order.indexOf(stage2);
};
export const stageComesAfter = (stage1, stage2) => {
    const order = Object.values(RegularComplaintThreadStage);
    return order.indexOf(stage1) > order.indexOf(stage2);
};
