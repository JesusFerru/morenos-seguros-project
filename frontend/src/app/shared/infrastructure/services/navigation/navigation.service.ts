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
            title: 'Compañías de Seguro',
            role: 'All',
            meta: [''],
            type: 'basic',
            icon: 'heroicons_outline:building-office-2',
            link: 'compañias',
        });

        menu.push({
            id: '444',
            title: 'Usuarios',
            role: 'All',
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
