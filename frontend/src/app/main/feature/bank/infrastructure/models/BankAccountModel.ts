export interface BankAccountModel {
    id: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    currency: string;
    holderName: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}