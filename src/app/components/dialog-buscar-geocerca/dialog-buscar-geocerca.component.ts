import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-dialog-buscar-geocerca',
  templateUrl: './dialog-buscar-geocerca.component.html',
  styleUrls: ['./dialog-buscar-geocerca.component.css']
})
export class DialogBuscarGeocercaComponent implements OnInit {

    public geocercas: any[] = [];
    public searchText = '';

    constructor(public dialogRef: MatDialogRef<DialogBuscarGeocercaComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                public localStorageService: LocalStorageService) { }

    ngOnInit() {
    }

    radioChange(event) {
        console.log('cambio button', event);
        this.dialogRef.close({geocerca: event});
    }

}
