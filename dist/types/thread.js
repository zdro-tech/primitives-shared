export var ThreadClass;
(function (ThreadClass) {
    ThreadClass["DOCTOR_CONSULTATION"] = "DOCTOR_CONSULTATION";
    ThreadClass["PRESCRIPTION_RELATED"] = "PRESCRIPTION_RELATED";
    ThreadClass["SICK_LEAVE_RELATED"] = "SICK_LEAVE_RELATED";
    ThreadClass["DOCTOR_REFERRAL_REQUEST"] = "DOCTOR_REFERRAL_REQUEST";
    ThreadClass["VACCINATION_REQUEST"] = "VACCINATION_REQUEST";
    ThreadClass["LAB_TESTS_REQUEST"] = "LAB_TESTS_REQUEST";
    ThreadClass["LAB_TESTS_EXPLANATIONS"] = "LAB_TESTS_EXPLANATIONS";
})(ThreadClass || (ThreadClass = {}));
export var QuickActionCode;
(function (QuickActionCode) {
    // POPULAR (Category 1)
    QuickActionCode["DOCTOR_REFERRAL_REQUEST"] = "DOCTOR_REFERRAL_REQUEST";
    QuickActionCode["LAB_TESTS_REQUEST"] = "LAB_TESTS_REQUEST";
    QuickActionCode["PRESCRIPTION_RELATED"] = "PRESCRIPTION_RELATED";
    QuickActionCode["SICK_LEAVE_RELATED"] = "SICK_LEAVE_RELATED";
    QuickActionCode["BIRTH_CONTROL"] = "BIRTH_CONTROL";
    QuickActionCode["VACCINATION_REQUEST"] = "VACCINATION_REQUEST";
    // GENERAL_CONSULTATION (Category 2)
    QuickActionCode["FLU"] = "FLU";
    QuickActionCode["VACCINATIONS"] = "VACCINATIONS";
    QuickActionCode["TRAVEL_VACCINATIONS"] = "TRAVEL_VACCINATIONS";
    // LAB_TESTS (Category 3)
    QuickActionCode["LAB_TESTS_EXPLANATIONS"] = "LAB_TESTS_EXPLANATIONS";
    // SEXUAL_HEALTH (Category 4)
    QuickActionCode["PERIODS"] = "PERIODS";
    QuickActionCode["EMERGENCY_BIRTH_CONTROL"] = "EMERGENCY_BIRTH_CONTROL";
    QuickActionCode["BETTER_SEX"] = "BETTER_SEX";
    QuickActionCode["SEXUAL_INFECTIONS"] = "SEXUAL_INFECTIONS";
    QuickActionCode["HORMONE_BALANCE"] = "HORMONE_BALANCE";
    // PEDIATRICS (Category 5)
    QuickActionCode["CHILD_VACCINE"] = "CHILD_VACCINE";
    QuickActionCode["CHILD_FEVER"] = "CHILD_FEVER";
    QuickActionCode["CHILD_RASH"] = "CHILD_RASH";
    QuickActionCode["CHILD_SLEEP"] = "CHILD_SLEEP";
    QuickActionCode["CHILD_BEHAVIOR"] = "CHILD_BEHAVIOR";
    // WEIGHT_MANAGEMENT (Category 6)
    QuickActionCode["LOSE_WEIGHT"] = "LOSE_WEIGHT";
    QuickActionCode["WEIGHT_GAIN"] = "WEIGHT_GAIN";
    QuickActionCode["METABOLISM"] = "METABOLISM";
    QuickActionCode["LIFESTYLE_CHANGE"] = "LIFESTYLE_CHANGE";
    // MENTAL (Category 7)
    QuickActionCode["LESS_ANXIETY"] = "LESS_ANXIETY";
    QuickActionCode["DEPRESSION"] = "DEPRESSION";
    QuickActionCode["FEEL_HAPPY"] = "FEEL_HAPPY";
    QuickActionCode["BETTER_SLEEP"] = "BETTER_SLEEP";
    QuickActionCode["STRESS_REDUCTION"] = "STRESS_REDUCTION";
    QuickActionCode["BURNOUT"] = "BURNOUT";
    QuickActionCode["NICOTINE_ADDICTION"] = "NICOTINE_ADDICTION";
    // SKIN_HAIR (Category 8)
    QuickActionCode["ACNE_CARE"] = "ACNE_CARE";
    QuickActionCode["HAIR_REGROW"] = "HAIR_REGROW";
    QuickActionCode["SKIN_RASH"] = "SKIN_RASH";
    QuickActionCode["DERMATITIS"] = "DERMATITIS";
    QuickActionCode["PSORIASIS"] = "PSORIASIS";
    QuickActionCode["SKIN_INFECTIONS"] = "SKIN_INFECTIONS";
    // DIGESTIVE (Category 9)
    QuickActionCode["BLOATING"] = "BLOATING";
    QuickActionCode["CONSTIPATION"] = "CONSTIPATION";
    QuickActionCode["STOMACH_COMFORT"] = "STOMACH_COMFORT";
    // ORTHOPEDICS (Category 10)
    QuickActionCode["JOINT_PAIN"] = "JOINT_PAIN";
    QuickActionCode["BACK_PAIN"] = "BACK_PAIN";
    QuickActionCode["NECK_PAIN"] = "NECK_PAIN";
    QuickActionCode["INJURY"] = "INJURY";
    // ALLERGY (Category 11)
    QuickActionCode["POLLEN_ALLERGY"] = "POLLEN_ALLERGY";
    QuickActionCode["FOOD_ALLERGY"] = "FOOD_ALLERGY";
    QuickActionCode["SKIN_ALLERGY"] = "SKIN_ALLERGY";
    QuickActionCode["PET_ALLERGY"] = "PET_ALLERGY";
    // ENDOCRINOLOGY (Category 12)
    QuickActionCode["DIABETES_MGMT"] = "DIABETES_MGMT";
    QuickActionCode["INSULIN_RESISTANCE"] = "INSULIN_RESISTANCE";
    QuickActionCode["THYROID_DISEASES"] = "THYROID_DISEASES";
    QuickActionCode["OBESITY_METABOLIC"] = "OBESITY_METABOLIC";
    // Common across multiple categories
    QuickActionCode["OTHER_QUESTION"] = "OTHER_QUESTION";
})(QuickActionCode || (QuickActionCode = {}));
// DOCTOR_REFERRAL_REQUEST = "DOCTOR_REFERRAL_REQUEST",
// LAB_TESTS_REQUEST = "LAB_TESTS_REQUEST",
// LAB_TESTS_EXPLANATIONS = "LAB_TESTS_EXPLANATIONS"
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
export var LabTestsThreadStage;
(function (LabTestsThreadStage) {
    LabTestsThreadStage["Initiation"] = "Initiation";
    LabTestsThreadStage["Problem_Statement"] = "Problem_Statement";
    LabTestsThreadStage["Assessment"] = "Assessment";
    LabTestsThreadStage["Select_Payment_Option"] = "Select_Payment_Option";
    //When paid
    LabTestsThreadStage["Payment"] = "Payment";
    LabTestsThreadStage["Ready_For_Doctor"] = "Ready_For_Doctor";
    LabTestsThreadStage["Treatment_Plan"] = "Treatment_Plan";
    LabTestsThreadStage["Diagnosis"] = "Diagnosis";
    LabTestsThreadStage["Treatment_Discussion"] = "Treatment_Discussion";
    //When not paid
    LabTestsThreadStage["Ready_For_Automatic_Review"] = "Ready_For_Automatic_Review";
    LabTestsThreadStage["AutomaticDiagnosis"] = "Automatic_Diagnosis";
    LabTestsThreadStage["Automatic_Treatment_Discussion"] = "Automatic_Treatment_Discussion";
    LabTestsThreadStage["Closure"] = "Closure";
    LabTestsThreadStage["Follow_Up"] = "Follow_Up";
    LabTestsThreadStage["Feedback"] = "Feedback";
})(LabTestsThreadStage || (LabTestsThreadStage = {}));
export const regularComplaintStageEqualOrComesAfter = (stage1, stage2) => {
    const order = Object.values(RegularComplaintThreadStage);
    return order.indexOf(stage1) >= order.indexOf(stage2);
};
export const regularComplaintStageComesAfter = (stage1, stage2) => {
    const order = Object.values(RegularComplaintThreadStage);
    return order.indexOf(stage1) > order.indexOf(stage2);
};
