// OdczytReceptyResponse
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
    }
}

//OdczytPakietuReceptResponse
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
    }
}

//WyszukanieReceptUslugobiorcyResponse
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
        wynik: FailureResponseResultDetails
    }
}

// RozszerzoneWyszukiwanieReceptUslugobiorcyResponse
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
    }
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
    birthDate: string; //YYYYMMDD
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
    prescriptionIssuanceDateTo?: string;    // Maps to <v202:dataWystawieniaReceptyDo>
    prescriptionIssuanceDateFrom?: string;  // Maps to <v202:dataWystawieniaReceptyOd>
    medicalWorkerIdExtension?: string;      // Part of <v202:idPracownikaMedycznego>
    medicalWorkerIdRoot?: string;           // Part of <v202:idPracownikaMedycznego>
    patientIdExtension: string;                   // Part of <v202:idUslugobiorcy>, <v203:extension>
    patientIdRoot: string;                  // Part of <v202:idUslugobiorcy>, <v203:root>
    prescriptionNumberExtension?: string;   // Part of <v202:numerRecepty>, <v203:extension>
    prescriptionNumberRoot?: string;        // Part of <v202:numerRecepty>, <v203:root>
}

export interface AdvancedPrescriptionSearchCriteria {
    prescriptionIssuanceDateTo?: string;        // Maps to <dataWystawieniaReceptyDo>
    prescriptionIssuanceDateFrom?: string;      // Maps to <dataWystawieniaReceptyOd>
    patientIdExtension: string;                 // Part of <idUslugobiorcy>, <wsp:extension>
    patientIdRoot: string;                      // Part of <idUslugobiorcy>, <wsp:root>
    medicationName?: string;                    // Maps to <nazwaLeku>
    prescriptionNumberExtension?: string;       // Part of <numerRecepty>, <wsp:extension>
    prescriptionNumberRoot?: string;            // Part of <numerRecepty>, <wsp:root>
    prescriptionStatus?: string;                // Maps to <statusRecepty>
    pagingParameters?: {                        // Maps to <parametryStronicowania>
        pageSize: number;
        pageNumber: number;
    };
    lifeThreateningSituation?: boolean;         // Maps to <czySytuacjaZagrozeniaZycia>
}

//ZapisPakietuReceptResponse
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
    }
}

//WeryfikacjaPakietuReceptResponse
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
    repeatNumber?: number; // number of treatment cycles, default 0
}

export interface HL7Dosage {
    doseQuantity?: number;  //num of medication unit (i.e tablets) per 1 intake (określa ilość leku, którą pacjent powinien brać przy jednym podaniu)
    rateQuantityUnit?: string; //injection speed (eg. inhales)
    rateQuantityValue?: number;  //injection speed (eg. 8)
    maxDoseQuantity?: number; //maximum quantity of medication unit
    periodUnit?: "h" | "d" | "wk" | "mo" | "/d" | "/wk" | "/mo"; // how frequently i.e hours
    periodValue?: number; // how frequently i.e 8 hours
    periodUnitValueString?: string
}


export interface HL7MedicationDetails {
    medicationCode: string;
    ean: string;
    medicationName: string; //Here also provide name + dosage + packaging i.e Mestinon 60 mg Tabletki drażowane
    package: HL7Quantity;
    activeSubstances?: HL7ActiveSubstance[];
}

export interface HL7BillingDetails {
    paymentStatus?: '100%' | '50%' | '30%' | 'B' | 'R';
}

export interface HL7Quantity {
    quantity?: number; // Number of packages
    unit?: string; // Type of package
    numberOfMedicationsInPackage?: number; //when it's absent, unit is used
}

export interface HL7ActiveSubstance {
    name: string;
    code?: string;
    quantity?: number;
    unit?: string;
}