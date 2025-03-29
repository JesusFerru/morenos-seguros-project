import { StandAssignmentDto } from './StandAssignmentDto';

export interface UpdateEventDto {
    Name: string;
    Type: number;
    Start: string;
    End: string;
    SendQR: boolean;
    OriginIds: string[];
    StandAssignments?: StandAssignmentDto[];
}