export interface PrescriptionReadResponse {
    OdczytReceptyResponse: {
        receptaIWynikWeryfikacji?: {
            statusRecepty: string;
            weryfikowanyDokument: {
                numerReceptyWPakiecie: string;
                kluczRecepty: string;
                wynikWeryfikacjiZbioruRegul: VerificationResult;
            };
            recepta: {
                identyfikatorDokumentuWPakiecie: string;
                tresc: string;
            };
        };
        wynik: FailureResponseResultDetails;
    };
}
export interface PackagePrescriptionReadResponse {
    OdczytPakietuReceptResponse: {
        pakietReceptIWynikowWeryfikacji?: {
            receptaIWynikWeryfikacji: {
                statusRecepty: string;
                weryfikowanyDokument: {
                    numerReceptyWPakiecie: string;
                    kluczRecepty: string;
                    wynikWeryfikacjiZbioruRegul: VerificationResult;
                };
                recepta: {
                    identyfikatorDokumentuWPakiecie: string;
                    tresc: string;
                };
            }[];
        };
        wynik: FailureResponseResultDetails;
    };
}
export interface PrescriptionSearchResponse {
    WyszukanieReceptUslugobiorcyResponse: {
        wynikiWyszukiwaniaReceptUslugobiorcy?: {
            wynikWyszukiwaniaReceptUslugobiorcy: {
                kluczRecepty: string;
                kluczPakietu: string;
                dataWystawieniaRecepty: string;
                numerRecepty: {
                    extension: string;
                    root: string;
                };
                statusRecepty: string;
                podmiotNazwa: string;
                wystawcaNazwa: string;
                identyfikatorPracownikaWystawcy: {
                    extension: string;
                    root: string;
                };
                identyfikatorPodmiotuWystawcy: {
                    extension: string;
                    root: string;
                };
            }[];
        };
        wynik: FailureResponseResultDetails;
    };
}
export interface ExtendedPrescriptionSearchResponse {
    RozszerzoneWyszukiwanieReceptUslugobiorcyResponse: {
        wynikiRozszerzonegoWyszukiwaniaReceptUslugobiorcy?: {
            wynikRozszerzonegoWyszukiwaniaReceptUslugobiorcy: {
                dataWystawieniaRecepty: string;
                dataRealizacjiOd: string;
                identyfikatorOpakowaniaLeku: string;
                iloscLeku: string;
                kluczRecepty: string;
                nazwaPrzepisanegoLeku: string;
                numerRecepty: {
                    extension: string;
                    root: string;
                };
                rodzajLeku: string;
                statusMozliwosciRealizacjiRecepty: string;
                statusRecepty: string;
                wielkoscOpakowania: string;
                poziomOdplatnosciRecepty: string;
            }[];
        };
        wynik: FailureResponseResultDetails;
    };
}
export interface FailureResponseResultDetails {
    major: string;
    minor?: string;
    komunikat: string;
}
export interface VerificationResult {
    wynikWeryfikacji: string;
    identyfikatorZbioruRegul: string;
}
export interface ZdroApiResponse<T> {
    success: boolean;
    message: T;
}
export interface HL7PrescriptionConfig {
    serviceRecipient: HL7ServiceRecipient;
    drugs: Array<HL7DrugConfig>;
    collectionVersionNumberExt?: string;
    effectiveTime: string;
    authorTime: string;
    legalAuthenticatorTime: string;
}
export interface HL7ServiceRecipient {
    pesel: string;
    gender: "UN" | "M" | "F";
    birthDate: string;
    firstName: string;
    lastName: string;
    country: string;
    postalCode: string;
    city: string;
    streetName: string;
    houseNumber: string;
    unitId?: string;
}
export interface HL7PrescriptionSearchCriteria {
    prescriptionIssuanceDateTo?: string;
    prescriptionIssuanceDateFrom?: string;
    medicalWorkerIdExtension?: string;
    medicalWorkerIdRoot?: string;
    patientIdExtension: string;
    patientIdRoot: string;
    prescriptionNumberExtension?: string;
    prescriptionNumberRoot?: string;
}
export interface AdvancedPrescriptionSearchCriteria {
    prescriptionIssuanceDateTo?: string;
    prescriptionIssuanceDateFrom?: string;
    patientIdExtension: string;
    patientIdRoot: string;
    medicationName?: string;
    prescriptionNumberExtension?: string;
    prescriptionNumberRoot?: string;
    prescriptionStatus?: string;
    pagingParameters?: {
        pageSize: number;
        pageNumber: number;
    };
    lifeThreateningSituation?: boolean;
}
export interface PackagePrescriptionRecordResponse {
    ZapisPakietuReceptResponse: {
        potwierdzenieOperacjiZapisu?: {
            wynikZapisuPakietuRecept: {
                kluczPakietuRecept: string;
                kodPakietuRecept: string;
                wynikWeryfikacji: {
                    weryfikowanaRecepta: {
                        numerReceptyWPakiecie: string;
                        kluczRecepty: string;
                        wynikWeryfikacjiZbioruRegul: VerificationResult;
                    }[];
                };
            };
        };
        wynik: FailureResponseResultDetails;
    };
}
export interface PrescriptionValidationResponse {
    WeryfikacjaPakietuReceptResponse: {
        potwierdzenieOperacjiWeryfikacji: {
            wynikWeryfikacjiRecept: {
                weryfikowanaRecepta: {
                    numerReceptyWPakiecie: string;
                    wynikWeryfikacjiZbioruRegul: {
                        wynikWeryfikacji: string;
                        identyfikatorZbioruRegul: string;
                    };
                }[];
            };
        };
        wynik: FailureResponseResultDetails;
    };
}
export interface HL7DrugConfig {
    effectiveTime: HL7EffectiveTime;
    dosage: HL7Dosage;
    medication: HL7MedicationDetails;
    billing: HL7BillingDetails;
}
export interface HL7EffectiveTime {
    issueDate: string;
    endDate?: string;
    repeatNumber?: number;
}
export interface HL7Dosage {
    doseQuantity?: number;
    rateQuantityUnit?: string;
    rateQuantityValue?: number;
    maxDoseQuantity?: number;
    periodUnit?: "h" | "d" | "wk" | "mo" | "/d" | "/wk" | "/mo";
    periodValue?: number;
    periodUnitValueString?: string;
}
export interface HL7MedicationDetails {
    medicationCode: string;
    ean: string;
    medicationName: string;
    package: HL7Quantity;
    activeSubstances?: HL7ActiveSubstance[];
}
export interface HL7BillingDetails {
    paymentStatus?: '100%' | '50%' | '30%' | 'B' | 'R';
}
export interface HL7Quantity {
    quantity?: number;
    unit?: string;
    numberOfMedicationsInPackage?: number;
}
export interface HL7ActiveSubstance {
    name: string;
    code?: string;
    quantity?: number;
    unit?: string;
}
//# sourceMappingURL=ezdrowie.d.ts.map