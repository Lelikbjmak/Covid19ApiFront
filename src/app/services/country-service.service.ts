import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { ErrorService } from './error-service.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private countryRoute = environment.countryRoute;

  constructor(private httpClient: HttpClient, private errorService: ErrorService) {
  }

  getPossibleCountries<T>(): Observable<T> {
    return this.httpClient.get<T>(this.countryRoute).pipe(
      retry(2),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    this.errorService.handleError(error.message);
    return throwError(() => error.message);
  }
}