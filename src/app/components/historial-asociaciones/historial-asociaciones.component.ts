import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-historial-asociaciones',
  templateUrl: './historial-asociaciones.component.html',
  styleUrls: ['./historial-asociaciones.component.css']
})
export class HistorialAsociacionesComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<HistorialAsociacionesComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
    }

}
