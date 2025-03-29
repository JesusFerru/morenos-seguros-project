import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';

export class IExportNetbase implements ChangePaginationModel {
    skip: number;
    take: number;
    previousPageIndex?: number;
    length?: number;
    startDate?: string | null;
    endDate?: string | null;
    documentNumber? : string | null;
    customerType? : string | null;
    gender? : string;
    city? : string;
    packageOptions? : string;
    paymentMethod? : string;
    sourceUrl? : string;

    constructor(data?: {
        skip?: number;
        take?: number;
        previousPageIndex?: number;
        length?: number;
        startDate?: string | null;
        endDate?: string | null;
        documentNumber? : string | null;
        customerType? : string | null;
        gender? : string;
        city? : string;
        packageOptions? : string;
        paymentMethod? : string;
        sourceUrl? : string;
    }) {
        this.take = data?.take ?? 10000;
        this.skip = data?.skip ?? 0;
        this.previousPageIndex = data?.previousPageIndex;
        this.length = data?.length;
        this.startDate = data?.startDate;
        this.endDate = data?.endDate;
        this.documentNumber = data?.documentNumber;
        this.customerType = data?.customerType;
        this.gender = data?.gender;
        this.city = data?.city;
        this.packageOptions = data?.packageOptions;
        this.paymentMethod = data?.paymentMethod;
        this.sourceUrl = data?.sourceUrl;
    }
}
