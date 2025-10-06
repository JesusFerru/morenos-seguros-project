import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { User } from 'app/shared/infrastructure/helpers/user.types';
import { getRoleOptions } from 'app/shared/infrastructure/helpers/user.utils';
import { UserService } from 'app/shared/infrastructure/services/user.service';
import { ClientService } from 'app/main/feature/client/infrastructure/services/client.service';
import { PolicyService } from 'app/main/feature/policy/infrastructure/services/policy.service';
import { InsuranceCompanyService } from 'app/main/feature/insurance-company/infrastructure/services/insurance-company.service';
import { PaymentService } from 'app/main/feature/payment/infrastructure/services/payment.service';
import { Subject, takeUntil, forkJoin, map, catchError, of } from 'rxjs';

interface DashboardStats {
    totalClients: number;
    totalPolicies: number;
    activePolicies: number;
    totalCompanies: number;
    totalPayments: number;
    recentPayments: number;
}

interface QuickAction {
    title: string;
    subtitle: string;
    icon: string;
    route: string;
    color: string;
    gradient: string;
}

@Component({
    selector: 'ms-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
    private _userService = inject(UserService);
    private _clientService = inject(ClientService);
    private _policyService = inject(PolicyService);
    private _companyService = inject(InsuranceCompanyService);
    private _paymentService = inject(PaymentService);
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _router = inject(Router);

    user: User;
    dashboardStats: DashboardStats;
    isLoading = true;
    quickActions: QuickAction[] = [];
    private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

    roles = getRoleOptions();

    ngOnInit(): void {
        this.initializeQuickActions();
        
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                this._changeDetectorRef.markForCheck();
            });

        this.loadDashboardData();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();
    }

    private initializeQuickActions(): void {
        this.quickActions = [
            {
                title: 'Gestionar Clientes',
                subtitle: 'Ver y administrar clientes',
                icon: 'heroicons_outline:users',
                route: '/clientes',
                color: 'text-blue-600',
                gradient: 'from-blue-400 to-blue-600'
            },
            {
                title: 'Gestionar Pólizas',
                subtitle: 'Administrar pólizas de seguros',
                icon: 'heroicons_outline:document-text',
                route: '/polizas',
                color: 'text-green-600',
                gradient: 'from-green-400 to-green-600'
            },
            {
                title: 'Compañías Aseguradoras',
                subtitle: 'Gestionar compañías',
                icon: 'heroicons_outline:building-office',
                route: '/compañias',
                color: 'text-purple-600',
                gradient: 'from-purple-400 to-purple-600'
            },
            {
                title: 'Gestionar Pagos',
                subtitle: 'Procesar y revisar pagos',
                icon: 'heroicons_outline:credit-card',
                route: '/pagos',
                color: 'text-orange-600',
                gradient: 'from-orange-400 to-orange-600'
            },
            {
                title: 'Planes de Seguro',
                subtitle: 'Administrar planes disponibles',
                icon: 'heroicons_outline:clipboard-document-list',
                route: '/planes',
                color: 'text-teal-600',
                gradient: 'from-teal-400 to-teal-600'
            },
            {
                title: 'Gestionar Usuarios',
                subtitle: 'Administrar usuarios del sistema',
                icon: 'heroicons_outline:user-group',
                route: '/usuarios',
                color: 'text-red-600',
                gradient: 'from-red-400 to-red-600'
            }
        ];
    }

    private loadDashboardData(): void {
        this.isLoading = true;

        forkJoin({
            clients: this._clientService.getAll().pipe(catchError(() => of([]))),
            policies: this._policyService.getAll().pipe(catchError(() => of([]))),
            companies: this._companyService.getAll().pipe(catchError(() => of([]))),
            payments: this._paymentService.getAll().pipe(catchError(() => of([])))
        }).pipe(
            map(data => {
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

                return {
                    totalClients: data.clients.length,
                    totalPolicies: data.policies.length,
                    activePolicies: data.policies.filter(p => p.isActive).length,
                    totalCompanies: data.companies.length,
                    totalPayments: data.payments.length,
                    recentPayments: data.payments.filter(p => new Date(p.createdAt) >= thirtyDaysAgo).length
                };
            }),
            takeUntil(this._unsubscribeAll)
        ).subscribe({
            next: (stats) => {
                this.dashboardStats = stats;
                this.isLoading = false;
                this._changeDetectorRef.markForCheck();
            },
            error: () => {
                this.isLoading = false;
                this.dashboardStats = {
                    totalClients: 0,
                    totalPolicies: 0,
                    activePolicies: 0,
                    totalCompanies: 0,
                    totalPayments: 0,
                    recentPayments: 0
                };
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    navigateTo(route: string): void {
        this._router.navigate([route]);
    }

    transform(roleValue: string): string {
        const match = this.roles.find(option => option.value === roleValue);
        return match?.label ?? roleValue;
    }

    getGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    }
}
