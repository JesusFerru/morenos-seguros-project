export interface PolicyModel {
    id: string;
    policyNumber: string;
    previousPolicyNumber?: string;
    titularClientId: string;
    agentId?: string;
    startDate: string;
    endDate: string;
    deductibleOptionId: string;
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    
    // Optional fields for display purposes - will be populated by the frontend
    titularClientName?: string;
    agentName?: string;
    deductible1?: number;
}