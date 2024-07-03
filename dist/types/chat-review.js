export var DosageUnit;
(function (DosageUnit) {
    DosageUnit["mg"] = "mg";
    DosageUnit["g"] = "g";
    DosageUnit["IU"] = "IU";
    DosageUnit["ml"] = "ml";
    DosageUnit["drops"] = "drops";
    DosageUnit["capsules"] = "capsules";
    DosageUnit["tablets"] = "tablets";
    DosageUnit["puffs"] = "puffs";
    DosageUnit["patches"] = "patches";
    DosageUnit["units"] = "units";
    DosageUnit["teaspoons"] = "teaspoons";
    DosageUnit["tablespoons"] = "tablespoons";
    DosageUnit["ounces"] = "ounces";
})(DosageUnit || (DosageUnit = {}));
export var Frequency;
(function (Frequency) {
    Frequency["ONCE_DAILY"] = "ONCE_DAILY";
    Frequency["TWICE_DAILY"] = "TWICE_DAILY";
    Frequency["THREE_TIMES_DAILY"] = "THREE_TIMES_DAILY";
    Frequency["FOUR_TIMES_DAILY"] = "FOUR_TIMES_DAILY";
    Frequency["AS_DESCRIBED"] = "AS_DESCRIBED";
})(Frequency || (Frequency = {}));
export var FileProcessingStage;
(function (FileProcessingStage) {
    FileProcessingStage[FileProcessingStage["UPLOADED"] = 0] = "UPLOADED";
    FileProcessingStage[FileProcessingStage["IN_PROCESSING"] = 1] = "IN_PROCESSING";
    FileProcessingStage[FileProcessingStage["ANALYZED"] = 2] = "ANALYZED";
    FileProcessingStage[FileProcessingStage["ANALYZE_ERROR"] = 3] = "ANALYZE_ERROR";
    FileProcessingStage[FileProcessingStage["SKIPPED"] = 4] = "SKIPPED"; // for not supported extensions
})(FileProcessingStage || (FileProcessingStage = {}));
