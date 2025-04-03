export interface UpdatePolicyDto {
    Name: string;
    Type: number;
    Start: string;
    End: string;
    SendQR: boolean;
    OriginIds: string[];
}
