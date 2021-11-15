import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-list-comandos',
  templateUrl: './dialog-list-comandos.component.html',
  styleUrls: ['./dialog-list-comandos.component.css']
})
export class DialogListComandosComponent implements OnInit {

  displayedColumns: string[] = ['index', 'comando'];
  dataSource: any;
  titulo = '';

  constructor(public dialogRef: MatDialogRef<DialogListComandosComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.dataSource = this.data.data;
    this.titulo = this.data.titulo;
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
