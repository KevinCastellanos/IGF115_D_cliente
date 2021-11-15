import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm-address',
  templateUrl: './dialog-confirm-address.component.html',
  styleUrls: ['./dialog-confirm-address.component.css']
})
export class DialogConfirmAddressComponent implements OnInit {

    checked = false;
    constructor(public dialogRef: MatDialogRef<DialogConfirmAddressComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
    }

    aceptar() {
        this.dialogRef.close({cancel: false, check: this.checked});
    }
}
