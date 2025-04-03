import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { BehaviorSubject, Subject } from 'rxjs';
import { PolicyService } from '../infrastructure/services/policy.service';
import { policyConfig } from './policy.config';
import { PolicyModel } from './PolicyModel';

@Component({
  selector: 'ms-policy',
  standalone: true,
  imports: [],
  templateUrl: './policy.component.html'
})
export class PolicyComponent implements OnInit, OnDestroy {
    private policyService = inject(PolicyService);

    columns = policyConfig;
    data$ = new BehaviorSubject<PolicyModel[]>([]);
    responsePagination: PaginationResponseModel<PolicyModel>;
    destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    loadData(): void {
        this.policyService.getAll().subscribe({
            next: (res) => {
                const transformedData = res.map(policy => ({
                    ...policy,
                }));

                this.responsePagination = {
                    totalRecords: transformedData.length,
                    data: transformedData,
                    pageNumber: 1,
                    pageSize: transformedData.length,
                    totalPages: 1,
                };
                this.data$.next(transformedData);
            },
            error: () => {
                console.error('Error al cargar los orígenes.');
            },
        });
    }
}
