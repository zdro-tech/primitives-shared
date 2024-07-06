export interface ShrankMedicinalProduct {
    id: string;
    medicinalProductName: string;
    commonName: string;
    medicinalProductPower: string;
    pharmaceuticalFormName: string;
    activeSubstanceName: string;
    atcCode: string;
    productVariations: ShrankMedicinalProductVariations[];
}

export interface ShrankMedicinalProductVariations {
    productId: number;
    gtin: string
    euNumber?: string;
    accessibilityCategory: string;
    packaging: string;
    packagingDescription?: string;
}

export interface ProducerOrImporter {
    subjectName: string;
    countryName: string;
}


export interface MedicinalProduct {
    productId: string;
    productName: string;
    commonName?: string;
    preparationType?: string;
    potency?: string;
    pharmaceuticalForm?: string;
    procedureType?: string;
    authorizationNumber?: string;
    authorizationValidity?: string;
    atcCode: string;
    responsibleEntity?: string;
    activeSubstance?: string;
    manufacturerName?: string;
    manufacturerCountry?: string;
    importerName?: string;
    importerCountry?: string;
    manufacturerImporterName?: string;
    manufacturerImporterCountry?: string;
    responsibleEntityInExportCountry?: string;
    exportCountry?: string;
    leafletUrl?: string;
    characteristicsUrl?: string;
    parallelImportLeafletUrl?: string;
    parallelImportPackagingMarking?: string;
}

export interface PackagingOption {
    productId: number;
    gtin: string;
    euNumber: string;
    accessibilityCategory: string;
    packagingDescription: string;
    recordNumber?: string;
}

export interface ResponseData {
    content: MedicinalProduct[];
    pageable: {
        sort: {
            unsorted: boolean;
            sorted: boolean;
            empty: boolean;
        };
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    sort: {
        unsorted: boolean;
        sorted: boolean;
        empty: boolean;
    };
    numberOfElements: number;
    size: number;
    number: number;
    empty: boolean;
}

export interface SearchParams {
    name?: string;
    substanceName?: string;
    atcCode?: string;
    gtin?: string;
    size?: number;
    page?: number;
    sorting?: string;
  }