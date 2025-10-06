import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from './navigation.types';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private _navigation: Navigation = new Navigation();
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _router: Router,
    ) {}
    /**
     * Get all navigation data
     */
    get(): Navigation {
        const menu: FuseNavigationItem[] = [];

        menu.push({
            id: '000',
            role: 'All',
            title: 'Home',
            type: 'basic',
            meta: [''],
            icon: 'heroicons_outline:home',
            link: 'home',
        });

        menu.push({
            id: '111',
            title: 'Opciones de Deducible',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:queue-list',
            link: 'deducibles',
        });

        menu.push({
            id: '444',
            title: 'Planes de Seguro',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:shield-check',
            link: 'planes',
        });

        menu.push({
            id: '444',
            title: 'Compañías Aseguradoras',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:building-office-2',
            link: 'compañias',
        });

        menu.push({
            id: '555',
            title: 'Cuentas Bancarias',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:credit-card',
            link: 'bancos',
        });

        menu.push({
            id: '666',
            title: 'Clientes',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:users',
            link: 'clientes',
        });

        menu.push({
            id: '666.5',
            title: 'Pólizas',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:document-text',
            link: 'polizas',
        });

        menu.push({
            id: '777',
            title: 'Miembros de Póliza',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:user-group',
            link: 'miembros-poliza',
        });

        menu.push({
            id: '888',
            title: 'Pagos',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:currency-dollar',
            link: 'pagos',
        });

        menu.push({
            id: '999',
            title: 'Usuarios',
            role: 'Admin',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:user',
            link: 'usuarios',
        });

        this._navigation.compact = menu;
        this._navigation.default = menu;
        this._navigation.futuristic = menu;
        this._navigation.horizontal = menu;

        return this._navigation;
    }
}
