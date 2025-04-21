export interface InsurancePlanModel {
    id: string;
    name: string;
    description: string;
    insuranceCompanyId: string;
    insuranceCompanyName?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    companyName?: string;
  }
