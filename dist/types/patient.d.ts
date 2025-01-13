export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    governmentalIdentifier: string;
    phoneNumber: string;
    email: string;
    city: string;
    postalCode: string;
    streetName: string;
    houseNumber: string;
    unitId: string;
    country: string;
    tenantId: number;
    language: string;
    createdAt: Date;
}
export declare const getPatientAge: (patient: Patient) => number;
export declare const getPatientMetaInformation: (patient: Patient, language: string) => string;
//# sourceMappingURL=patient.d.ts.map