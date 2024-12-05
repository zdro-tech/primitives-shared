export var ThreadClass;
(function (ThreadClass) {
    ThreadClass[ThreadClass["DOCTOR_CONSULTATION"] = 0] = "DOCTOR_CONSULTATION";
    ThreadClass[ThreadClass["PRESCRIPTION_RELATED"] = 1] = "PRESCRIPTION_RELATED";
    ThreadClass[ThreadClass["SICK_LEAVE_RELATED"] = 2] = "SICK_LEAVE_RELATED";
    ThreadClass[ThreadClass["TESTS_INTERPRETATION"] = 3] = "TESTS_INTERPRETATION";
    ThreadClass[ThreadClass["APPOINTMENT_SCHEDULING"] = 4] = "APPOINTMENT_SCHEDULING";
    ThreadClass[ThreadClass["OTHER_QUESTIONS"] = 5] = "OTHER_QUESTIONS";
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
    RegularComplaintThreadStage["Follow_Up"] = "Follow_Up"; //when patient is providing follow up information after some time
})(RegularComplaintThreadStage || (RegularComplaintThreadStage = {}));
export const stageEqualOrComesAfter = (stage1, stage2) => {
    const order = Object.values(RegularComplaintThreadStage);
    return order.indexOf(stage1) >= order.indexOf(stage2);
};
export const stageComesAfter = (stage1, stage2) => {
    const order = Object.values(RegularComplaintThreadStage);
    return order.indexOf(stage1) > order.indexOf(stage2);
};
