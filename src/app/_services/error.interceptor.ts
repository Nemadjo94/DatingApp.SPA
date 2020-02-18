import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// This is our http error interceptor which has been around since Angular 4.3
// Interceptor catches http error responses from our api
// We handle these error globally with interceptor
// Http interceptor intercepts our http requests and responses from the server depending on what we're looking for

@Injectable()
export class ErrorInteceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse){ // This means that this is an error from our API
                    if (error.status === 401) {
                        return throwError(error.statusText);
                    }

                    const applicationError = error.headers.get('Application-Error'); // First we check for application errors

                    if (applicationError) {
                        console.error(applicationError);
                        return throwError(applicationError);
                    }

                    // tslint:disable-next-line: max-line-length
                    const serverError = error.error; // Get the server error. If using .net 2.2 the error is returned inside another error object. So use error.error.errors
                    let modalStateErros = '';

                    if (serverError && typeof serverError === 'object') { // Check to see if its the type of object
                        for (const key in serverError) {
                            if (serverError[key]) {
                                modalStateErros += serverError[key] + '\n';
                            }
                        }
                    }
                    // This accomodates all the different types of errors our API can throw
                    return throwError(modalStateErros || serverError || 'Server Error'); // Pass back errors

                }
            })
        );
    }

}

export const ErrorInteceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInteceptor,
    multi: true
}
