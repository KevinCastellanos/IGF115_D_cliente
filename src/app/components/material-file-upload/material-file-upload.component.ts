import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpResponse, HttpRequest, 
         HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { catchError, last, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-material-file-upload',
  templateUrl: './material-file-upload.component.html',
  styleUrls: ['./material-file-upload.component.css'],
      animations: [
            trigger('fadeInOut', [
                  state('in', style({ opacity: 100 })),
                  transition('* => void', [
                        animate(300, style({ opacity: 0 }))
                  ])
            ])
      ]
})
export class MaterialFileUploadComponent implements OnInit {
  /** Link text */
      @Input() text = 'Cargar archivo txt';
      /** Name used in form which will be sent in HTTP request. */
      @Input() param = 'file';
      /** Target URL for file uploading. */
      @Input() target = 'https://aps.tkontrol.com/api/upload-file-tkontrol';
      /** File extension that accepted, same as 'accept' of <input type="file" />.
      By the default, it's set to 'image/*'. 
      // tslint:disable-next-line: jsdoc-format
      // tslint:disable-next-line: jsdoc-format
      */
      @Input() accept = 'txt/*';
      /** Allow you to add handler after its completion. Bubble up response text from remote. */
      @Output() complete = new EventEmitter<string>();

      public files: Array<FileUploadModel> = [];

      public nombreArchivo = '';
      public textoArchivo = '';

      constructor(private _http: HttpClient) { }

      ngOnInit() {
      }

      onClick() {
            const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
            fileUpload.onchange = () => {
                  // tslint:disable-next-line: prefer-for-of
                  for (let index = 0; index < fileUpload.files.length; index++) {
                        const file = fileUpload.files[index];
                        this.files.push({ data: file,
                                          state: 'in',
                                          inProgress: false,
                                          progress: 0,
                                          canRetry: false,
                                          canCancel: true
                                    });
                        var reader = new FileReader();
                        reader.onload = () => {
                            // console.log(reader.result);
                            this.textoArchivo = String(reader.result);
                        };
                        // console.log('nombre archivo: ', file.name);
                        this.nombreArchivo = file.name;
                        reader.readAsText(file);
                        // console.log(reader.readAsText(file));
                        // this.textoArchivo = String(reader.readAsText(file));
                  }
                  this.uploadFiles();
            };
            fileUpload.click();
      }

      cancelFile(file: FileUploadModel) {
            file.sub.unsubscribe();
            this.removeFileFromArray(file);
      }

      retryFile(file: FileUploadModel) {
            this.uploadFile(file);
            file.canRetry = false;
      }

      private uploadFile(file: FileUploadModel) {
            const fd = new FormData();
            fd.append(this.param, file.data);

            const req = new HttpRequest('POST', this.target, fd, {
                  reportProgress: true
            });

            file.inProgress = true;
            file.sub = this._http.request(req).pipe(
                  map(event => {
                        switch (event.type) {
                              case HttpEventType.UploadProgress:
                                    file.progress = Math.round(event.loaded * 100 / event.total);
                                    break;
                              case HttpEventType.Response:
                                    return event;
                        }
                  }),
                  tap(message => { }),
                  last(),
                  catchError((error: HttpErrorResponse) => {
                        file.inProgress = false;
                        file.canRetry = true;
                        return of(`${file.data.name} upload failed.`);
                  })
            ).subscribe(
                  (event: any) => {
                        if (typeof (event) === 'object') {
                              event.body = {
                                    nombre: this.nombreArchivo,
                                    cuerpo: this.textoArchivo
                              };
                              this.complete.emit(event.body);
                              this.removeFileFromArray(file);

                        }
                  }
            );
      }

      private uploadFiles() {
            const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
            fileUpload.value = '';

            this.files.forEach(file => {
                  this.uploadFile(file);
            });
      }

      private removeFileFromArray(file: FileUploadModel) {
            const index = this.files.indexOf(file);
            if (index > -1) {
                  this.files.splice(index, 1);
            }
      }

}

export class FileUploadModel {
      data: File;
      state: string;
      inProgress: boolean;
      progress: number;
      canRetry: boolean;
      canCancel: boolean;
      sub?: Subscription;
}
