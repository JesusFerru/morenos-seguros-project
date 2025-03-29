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
            id: '444',
            title: 'Eventos',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:calendar-days',
            link: 'event',
        });

        menu.push({
            id: '444',
            title: 'Orígenes',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:link',
            link: 'origin',
        });

        menu.push({
            id: '444',
            title: 'Stands',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:building-storefront',
            link: 'stand',
        });

        menu.push({
            id: '555',
            role: 'All',
            title: 'Reportería',
            type: 'collapsable',
            meta: [''],
            icon: 'heroicons_outline:presentation-chart-bar',
            children: [
                {
                    id: 'apps..netbase-form',
                    role: 'All',
                    title: 'BD Madre',
                    type: 'basic',
                    meta: [],
                    icon: 'heroicons_outline:circle-stack',
                    link: '/reportery/netbase-form',
                },
                {
                    id: 'apps..customer-event',
                    role: 'All',
                    title: 'Clientes por Evento',
                    type: 'basic',
                    meta: [],
                    icon: 'heroicons_outline:chart-pie',
                    link: '/reportery/customer-event',
                },
            ],
        });

        menu.push({
            id: '444',
            title: 'Usuarios',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:user',
            link: 'user',
        });

        this._navigation.compact = menu;
        this._navigation.default = menu;
        this._navigation.futuristic = menu;
        this._navigation.horizontal = menu;

        return this._navigation;
    }
}
