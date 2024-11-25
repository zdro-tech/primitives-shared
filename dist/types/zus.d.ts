export interface SicknessCode {
    session: string;
    code?: string;
    beginningDate?: string;
    pesel?: string;
    idNumber?: string;
}
export interface PobierzDaneLekarzaResponse {
    pobierzDaneLekarzaResponse: {
        DaneLekarza: {
            Imie: string;
            Nazwisko: string;
            Pesel: string;
            NumerPrawaWykonywaniaZawodu: string;
            NazwaOkregowejIzbyLekarskiej: string;
            StatusLekarza: {
                DataWydaniaDecyzji: string;
                Status: string;
            };
            Adres: {
                Ulica: string;
                NrDomu: string;
                KodPocztowy: string;
                Miejscowosc: string;
            };
            MiejsceWykonywaniaZawodu: {
                Nazwa: string;
                NIP: string;
                Ulica: string;
                NrDomu: string;
                NrLokalu: string;
                KodPocztowy: string;
                Miejscowosc: string;
            };
        };
        Rezultat: {
            KodBledu: string;
            OpisBledu: string;
        };
    };
}
export interface GetEmploymentPlaceResponse {
    pobierzMiejsceWykonywaniaZawoduResponse: {
        Rezultat: {
            KodBledu: string;
            OpisBledu: string;
        };
        MiejsceWykonywaniaZawodu: {
            Nazwa: string;
            NIP: string;
            Ulica: string;
            NrDomu: string;
            NrLokalu: string;
            KodPocztowy: string;
            Miejscowosc: string;
        };
    };
}
export interface GetPatientPayersResponse {
    pobierzPlatnikowUbezpieczonegoResponse: {
        Rezultat: {
            KodBledu: string;
            OpisBledu: string;
        };
        Platnik: {
            Nazwa: string;
            Imie: string;
            Nazwisko: string;
            NIP: string;
            Pesel: string;
            SeriaNumerPaszportu: string;
            ProfilPUE: string;
        };
    };
}
export interface GetSicknessCodeResponse {
    pobierzLiterowyKodChorobyResponse: {
        Rezultat: {
            KodBledu: string;
            OpisBledu: string;
        };
        KodA: string;
        KodD: string;
    };
}
export interface GetDocumentIDsCodeResponse {
    pobierzIdentyfikatorDokumentuResponse: {
        Rezultat: {
            KodBledu: string;
            OpisBledu: string;
        };
        IdDokumentu: string[];
    };
}
export interface GetSeriaAndNumberResponse {
    pobierzSeriaNumerZlaResponse: {
        Rezultat: {
            KodBledu: string;
            OpisBledu: string;
        };
        out: {
            KolekcjaPaczekDokumentowZla: {
                Oryginal: {
                    idDokumentu: string;
                };
                Kopia: {
                    idDokumentu: string;
                };
                SeriaNumer: string;
            };
        };
    };
}
export interface ValidateDocumentResponse {
    walidujDokumentyResponse: {
        Rezultat: {
            KodBledu: string;
            OpisBledu: string;
        };
        RezultatWalidacji: {
            Rezultat: string;
            BladWalidacji: Array<{
                NrRef: string;
                Rodzaj: string;
                KodBledu: string;
                OpisBledu: string;
                Lokalizacja: string;
            }>;
        };
    };
}
export interface SentDocumentsResponse {
    wyslijDokumentyResponse: {
        Rezultat: {
            KodBledu: string;
            OpisBledu: string;
        };
        RezultatWalidacji?: {
            Rezultat: string;
            BladWalidacji: {
                NrRef: string;
                Rodzaj: string;
                KodBledu: string;
                OpisBledu: string;
                Lokalizacja: string;
            };
        };
        RezultatWysylki: {
            NrRef: string[];
            Wynik: string;
            UtworzoneUPP?: UtworzoneUPP[];
        };
    };
}
export interface UtworzoneUPP {
    UPP: string;
}
export interface IdentyfikacjaUbezpieczonego {
    Pesel?: string;
    SeriaNumerPaszportu?: string;
}
export interface PatientAdres {
    KodPocztowy?: string;
    Miejscowosc?: string;
    Ulica?: string;
    NrDomu?: string;
    NrLokalu?: string;
    ZagranicznyKodPocztowy?: string;
    NazwaPanstwa?: string;
    KodPanstwa?: string;
}
export interface Ubezpieczony {
    Imie: string;
    Nazwisko: string;
    DataUrodzenia?: string;
    DataZgonu?: string;
    Adres?: PatientAdres[];
}
export interface DocTypeRefRezultat {
    KodBledu: string;
    OpisBledu: string;
}
export interface PobierzDaneUbezpieczonegoResponse {
    DaneUbezpieczonego?: Ubezpieczony;
    Rezultat: DocTypeRefRezultat;
    PrzekroczonyDziennyLimitDostepow?: string;
}
export interface IdentyfikacjaPlatnika {
    Pesel?: string;
    SeriaNumerPaszportu?: string;
    Nip?: string;
}
export interface Platnik {
    PlatnikIstnieje?: boolean;
    Nazwa?: string;
    Imie?: string;
    Nazwisko?: string;
    MaProfilPue?: boolean | null;
}
export interface PobierzDanePlatnikaResponse {
    DanePlatnika?: Platnik;
    Rezultat: DocTypeRefRezultat;
}
//# sourceMappingURL=zus.d.ts.map