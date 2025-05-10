export interface CustomerModel {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    documentType: string;
    documentNumber: string;
    birthDate: string;
    nit?: string;
    businessName?: string;
    email?: string;
    city?: string;
    address?: string;
    employmentStatus?: string;
    fundOrigin?: string;
    incomeRange?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
