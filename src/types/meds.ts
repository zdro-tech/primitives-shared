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
    packaging: string;
    gtin: string
    accessibilityCategory: string;
}

export interface ProducerOrImporter {
    subjectName: string;
    countryName: string;
}


export interface MedicinalProduct {
    id: string;
    count: string;
    medicinalProductName: string;
    commonName: string;
    medicinalProductPower: string;
    pharmaceuticalFormName: string;
    registryNumber: string;
    expirationDateString: string;
    subjectMedicinalProductName: string;
    procedureTypeName: string;
    specimenType: string;
    activeSubstanceName: string;
    atcCode: string;
    gracePeriod: string;
    characteristicFileName: boolean;
    leafletFileName: boolean;
    packageFileName: boolean;
    parallelImportLeafletFileName: boolean;
    parallelImportPackageMarkingFileName: boolean;
    parallelImportAdditionalDocumentOneFileName: boolean;
    parallelImportAdditionalDocumentTwoFileName: boolean;
    decisionsAttachment: boolean;
    rmpSummary: string;
    targetSpecies: string;
    packaging: string;
    distributor: string;
    euNumber: string;
    accessibilityCategory: string;
    gtin: string;
    parallelPackaging: string;
    parallelDistributor: string;
    parallelEuNumber: string;
    parallelAccessibilityCategory: string;
    parallelGtin: string;
    deletedPackaging: string;
    deletedDistributor: string;
    deletedEuNumber: string;
    deletedAccessibilityCategory: string;
    deletedGtin: string;
    producersOrImporters: ProducerOrImporter[];
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