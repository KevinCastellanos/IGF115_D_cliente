import { Component, OnInit, Inject } from '@angular/core';

import { NbCalendarRange, NbDateService } from '@nebular/theme';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

export interface DialogData {
  title: string;
  body: string;
}

@Component({
  selector: 'app-dialog-calendar',
  templateUrl: './dialog-calendar.component.html',
  styleUrls: ['./dialog-calendar.component.css']
})
export class DialogCalendarComponent implements OnInit {

    date = new Date();
    public range: any;

    public conHoras = false;

    // horas de inicio
    public hInicio = '12:00 am';
    public hFinal = '11:59 pm';

    constructor(public dialogRef: MatDialogRef<DialogCalendarComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                protected dateService: NbDateService<Date>,
                public localStorageService: LocalStorageService) {
        this.range = {
            start: this.dateService.addDay(this.date, 0),
            end: this.dateService.addDay(this.date, 0),
            hInit: moment(this.hInicio, 'HH:mm A').format('HH:mm:ss'),
            hEnd: moment(this.hFinal, 'HH:mm A').format('HH:mm:ss')
        };
    }

    ngOnInit() {

        console.log('hora formateada: ', moment('12:37 am', 'HH:mm A').format('HH:mm:ss'));
    }

    fecha() {
        console.log(this.range.end);
    }

    onNoClick(): void {
        this.dialogRef.close({cancel: true});
    }

    seleccionarFechaHora() {
        // console.log('hora normal: ', this.hInicio);
        // console.log('hora form: ', moment(this.hInicio, 'HH:mm A').format('HH:mm:ss'));

        this.range.hInit = moment(this.hInicio, 'HH:mm A').format('HH:mm:ss');
        this.range.hEnd = moment(this.hFinal, 'HH:mm A').format('HH:mm:ss');
        this.dialogRef.close(this.range);
    }

    get monthStart(): Date {
        return this.dateService.getMonthStart(new Date());
    }

    get monthEnd(): Date {
        return this.dateService.getMonthEnd(new Date());
    }

    cambio(ev) {
        // console.log('ev: ', ev);
        // console.log('var: ', this.conHoras);
        this.conHoras = ev;
    }

}
