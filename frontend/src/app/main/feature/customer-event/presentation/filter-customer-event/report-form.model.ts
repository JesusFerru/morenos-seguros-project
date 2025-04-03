import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { CustomerFilterType, CustomersGender } from '../../infrastructure/models/CustomerEventModel';

export class IReportCustomerEvent implements ChangePaginationModel {
    skip: number;
    take: number;
    previousPageIndex?: number;
    length?: number;
    startDate?: string | null;
    endDate?: string | null;
    filterType?: CustomerFilterType; 
    gender?: CustomersGender;
    eventId?: string | null;

    constructor(data?: {
        skip?: number;
        take?: number;
        previousPageIndex?: number;
        length?: number;
        startDate?: string | null;
        endDate?: string | null;
        filterType?: CustomerFilterType;
        gender?: CustomersGender;
        eventId?: string | null;
    }) {
        this.take = data?.take ?? 10000;
        this.skip = data?.skip ?? 0;
        this.previousPageIndex = data?.previousPageIndex;
        this.length = data?.length;
        this.startDate = data?.startDate;
        this.endDate = data?.endDate;
        this.filterType = data?.filterType;
        this.gender = data?.gender;
        this.eventId = data?.eventId;
    }
}
