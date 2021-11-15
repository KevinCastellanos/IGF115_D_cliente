import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = 'jvuvuh';

        let request = req;

        if (token) {
            request = req.clone({
                // headers: request.headers.set('Authorization', 'access-token ' + token)
                setHeaders: {
                    'access-token': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNTc5OTA2MzQwLCJleHAiOjE1Nzk5Mjc5NDB9.jjqKk8wgshozPDJwItJ4cLu9bgORuekGD6QoAZStum4`,
                }
            });
        }

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {

                if (err.status === 401) {
                    this.router.navigateByUrl('/login');
                }

                return throwError( err );

            })
        );
    }
}
