export interface PaymentModel {
    id: string;
    policyNumber: string;
    paymentDate: string;
    period: string;
    paymentMethod: string;
    amount: number;
    receiptUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    
    // Optional fields for display purposes - can be populated from policy data
    policyStatus?: string;
    titularClientName?: string;
}