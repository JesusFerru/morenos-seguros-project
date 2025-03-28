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
            role: 'Admin',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:calendar-days',
            link: 'event',
        });

        menu.push({
            id: '444',
            title: 'Orígenes',
            role: 'Admin',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:link',
            link: 'origin',
        });

        menu.push({
            id: '444',
            title: 'Stands',
            role: 'Admin',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:building-storefront',
            link: 'stand',
        });

        // menu.push({
        //     id: '444',
        //     title: 'Reportería',
        //     role: 'Admin',
        //     meta: ['aosinaga', 'vmoog', 'jtorrez'],
        //     type: 'basic',
        //     icon: 'heroicons_outline:presentation-chart-bar',
        //     link: 'netbase-form',
        // });

        menu.push({
            id: '555',
            role: 'Admin',
            title: 'Reportería',
            type: 'collapsable',
            meta: [''],
            icon: 'heroicons_outline:presentation-chart-bar',
            children: [
                {
                    id: 'apps..netbase-form',
                    role: 'Admin',
                    title: 'BD Madre',
                    type: 'basic',
                    meta: [],
                    icon: 'heroicons_outline:circle-stack',
                    link: '/reportery/netbase-form',
                },
                {
                    id: 'apps..customer-event',
                    role: 'Admin',
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
            role: 'Admin',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:user',
            link: 'user',
        });




        // menu.push({
        //     id: '555',
        //     role: '',
        //     title: 'Integraciones',
        //     type: 'collapsable',
        //     meta: this.authorizedNdcUsers,
        //     icon: 'heroicons_outline:cog-6-tooth',
        //     children: [
        //         {
        //             id: 'apps..we-unviersal-assistance',
        //             role: '',
        //             title: 'Universal Assistance',
        //             type: 'basic',
        //             meta: ['aosinaga'],
        //             icon: 'heroicons_outline:clipboard-document-list',
        //             link: '/integraciones/universal-assistance',
        //         },
        //         {
        //             id: 'apps..ndc-ticket',
        //             role: '',
        //             title: 'Boletos NDC',
        //             type : 'basic',
        //             meta: this.authorizedNdcUsers,
        //             icon : 'heroicons_outline:ticket',
        //             link : '/integraciones/ndc-ticket',
        //         },
        //         {
        //             id: 'apps..we-travel',
        //             role: 'BACK.ADM.',
        //             title: 'Pagos WeTravel',
        //             type : 'basic',
        //             meta: [''],
        //             icon : 'heroicons_outline:currency-dollar',
        //             link : '/integraciones/we-travel',
        //         },
        //         {
        //             id: 'apps..amadeus-air',
        //             title: 'Archivos AIR',
        //             meta: ['aosinaga'],
        //             type : 'basic',
        //             icon : 'heroicons_outline:document-text',
        //             link : '/integraciones/amadeus-air',
        //         },
        //     ],
        // });

        this._navigation.compact = menu;
        this._navigation.default = menu;
        this._navigation.futuristic = menu;
        this._navigation.horizontal = menu;
        return this._navigation;
    }
}
