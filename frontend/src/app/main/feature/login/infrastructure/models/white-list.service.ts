import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WhiteListService {
    private tsoUsers: string[] = [
        'cjustinian',
        'gflores',
        'kbarrient1',
        'skeenan',
        'vleiva',
        'murenda',
        'emorin',
        'acepeda',
        'mfgalarza',
        'jllanos',
        'lrobledo',
        'dtupa',
        'pduenas',
        'aosinaga',
        'avida1',
        'cdabdoub',
        'eromero',
        'rcabrera',
        'enota',
        'dguzman',
        'rjordan',
        'ntoro1',
        'djaldin',
        'abalcazar',
        'ccobo',
        'acortez',
        'imercado',
        'jainfan',
        'narodas',
        'nsanchez8',
        'vduran',
        'ktorrez',
        'miruiz',
        'aconde',
        'sroja2',
        'nortega1',
        'sramirez5',
        'lzeballos',
        'ssuarez',
        'dvacadiez',
        'lterrazas',
        'knota',
        'nsanchez8',
        'vmoog',
    ];

    isTSOUser(username: string): boolean {
        return true;
    }
}
