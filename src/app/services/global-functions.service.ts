import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

    constructor() { }

    filterItems(arr: any, query: string) {
        return arr.filter(function(el: any) {
            return el.indexOf(query) > -1;
        });
    }
}
