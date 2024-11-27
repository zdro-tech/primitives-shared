
export interface Organization {
    id: number;
    organizationName: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrganizationMember {
    id: number;
    organizationId: number;
    tenantId: number;
    createdAt: string;
}

export interface OrganizationZdroMapping {
    id: number;
    organizationId: number;
    zdroOrganizationId: number;
    createdAt: string;
    updatedAt: string;
}

export interface TenantZdroWorkplaceMapping {
    id: number;
    tenantId: number;
    zdroWorkplaceId: number;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorZdroMapping {
    id: number;
    doctorId: string;
    zdroServiceProviderId: number;
    createdAt: string;
    updatedAt: string;
}
