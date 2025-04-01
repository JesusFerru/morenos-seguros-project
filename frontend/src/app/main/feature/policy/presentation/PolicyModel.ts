export class PolicyModel {
    id?: string;
    code?: number;
    name?: string;
    type?: string;
    start?: string;
    end?: string;
    sendQR?: boolean;
    origins?: string[];
    stands?: string[];
}
