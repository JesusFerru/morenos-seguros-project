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
}