export interface DeductibleOptionModel {
    id: string;
    deductibleIndividual: number;
    deductibleFamily: number;
    currency: string;
    insurancePlanId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    insurancePlanName?: string;
  }
