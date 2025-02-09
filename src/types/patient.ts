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
