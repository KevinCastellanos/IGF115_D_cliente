import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
    providedIn: 'root'
})
export class CompService {

    private drawer: MatDrawer;
    private drawerMonitoreo: MatDrawer;
    public icon = 'keyboard_arrow_left';
    public iconMonitoreo = 'keyboard_arrow_left';

    constructor() { }

    public setDrawer(drawer: MatDrawer) {
        this.drawer = drawer;
    }

    public toggle(): void {
        this.drawer.toggle();
        if (this.icon === 'keyboard_arrow_left') {
            this.icon = 'keyboard_arrow_right';
        } else {
            this.icon = 'keyboard_arrow_left';
        }
    }

    public toggleIcon() {

        if (this.icon === 'keyboard_arrow_left') {
            this.icon = 'keyboard_arrow_right';
        } else {
            this.icon = 'keyboard_arrow_left';
        }
    }

    public setDrawerMonitoreo(drawer: MatDrawer) {
        this.drawerMonitoreo = drawer;
    }

    public toggleMonitoreo(): void {
        this.drawerMonitoreo.toggle();
        if (this.icon === 'keyboard_arrow_left') {
            this.icon = 'keyboard_arrow_right';
        } else {
            this.icon = 'keyboard_arrow_left';
        }
    }

    public toggleIconMonitoreo() {

        if (this.icon === 'keyboard_arrow_left') {
            this.icon = 'keyboard_arrow_right';
        } else {
            this.icon = 'keyboard_arrow_left';
        }
    }


}
