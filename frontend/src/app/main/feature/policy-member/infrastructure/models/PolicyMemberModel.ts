export interface PolicyMemberModel {
    id: string;
    isTitular: boolean;
    entryDate: string;
    status: string;
    exclusions: string;
    memberType: string;
    clientId: string;
    policyId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    // Optional fields for display purposes
    clientName?: string;
    policyName?: string;
}