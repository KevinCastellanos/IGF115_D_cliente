import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';

export interface DialogData {
  title: string;
  body: string;
}

@Component({
  selector: 'app-dialog-etiqueta',
  templateUrl: './dialog-etiqueta.component.html',
  styleUrls: ['./dialog-etiqueta.component.css']
})
export class DialogEtiquetaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogEtiquetaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public localStorageService: LocalStorageService) { }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
