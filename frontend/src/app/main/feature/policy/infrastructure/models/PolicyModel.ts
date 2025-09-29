export interface PolicyModel {
    id: string;
    policyNumber: string;
    previousPolicyNumber: string;
    titularClientId: string;
    agentId: string;
    startDate: string;
    endDate: string;
    deductibleOptionId: string;
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    // Optional fields for display
    titularClientName?: string;
    agentName?: string;
    deductibleOptionName?: string;
}