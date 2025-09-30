export interface DeductibleOptionModel {
    id: string;
    deductible1: number;
    deductible2 : number;
    currency: string;
    insurancePlanId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    insurancePlanName?: string;
  }
