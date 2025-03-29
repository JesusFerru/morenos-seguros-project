export class CustomerEventModel {
    documentNumber: string;
    gender?: string;
    eventId: string;
    event: any;
    city?: string;
    archetype?: string;
    birthDate?: string | null;
    onlineRegistrationDate?: string | null;
    onsiteRegistrationDate?: string | null;
    entryDate?: string | null;
    standAssignmentDate?: string | null;
    regIngressId?: string | null;
    regIngress?: any;
    conciergeId?: string | null;
    concierge?: any;
    hasTraveledAbroad?: boolean;
    hasSpecificTravelDate?: boolean;
    hasSpecificDestination?: boolean;
    ticketOrPackageInterest?: string;
    paymentMethod?: string;
    standId?: string;
    stand?: any;
    originId?: string;
    origin?: any;
}

export enum CustomerFilterType {
    preregistered = 'preregistered', 
    entered = 'entered',             
    both = 'both'                    
  }
  
  export enum CustomersGender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
  }
