import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { MaxMinCovidDetails } from '../model/MaxMinCovidDetailsInterface';
import { ErrorService } from './error-service.service';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  constructor(private httpClient: HttpClient, private errorService: ErrorService) {
  }

  getSummaryForDay(day: string, countrySlugList: string[]): Observable<MaxMinCovidDetails> {

    let requestedDay: Date = new Date(day);
    let today = new Date();

    if (requestedDay.getFullYear() === today.getFullYear() &&
      requestedDay.getMonth() === today.getMonth() &&
      requestedDay.getDate() === today.getDate()) {
      console.log("For current day");

      return this.httpClient.post<MaxMinCovidDetails>(environment.currentDayCovidCasesRoute, countrySlugList).pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );

    } else {
      console.log("For certain day");
      console.log("dayUrl: " + environment.anyDayCovidCasesRoute.concat(day));
      return this.httpClient.post<MaxMinCovidDetails>(environment.anyDayCovidCasesRoute.concat(day), countrySlugList).pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
    }

  }

  getSummaryForTerm(countrySlugList: string[], firstDay: string, lastDay: string): Observable<MaxMinCovidDetails> {
    console.log("For term: " + firstDay + " - " + lastDay);
    const params = new HttpParams()
      .set('from', firstDay)
      .set('to', lastDay);
    return this.httpClient.post<MaxMinCovidDetails>(environment.termCovidCasesRoute, countrySlugList, { params }).pipe(
      retry(2),
      catchError(this.handleError.bind(this))
    );
  }


  private handleError(error: HttpErrorResponse) {
    this.errorService.handleError(error.message);
    return throwError(() => error.message);
  }
}
