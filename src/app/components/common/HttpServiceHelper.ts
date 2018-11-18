
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import { IDocument } from '../user-data/document';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceHelper {
  
  constructor(private http: HttpClient) {
  }

  public httpGetRequest(url: string) {
    return this.http.get(url)
    .pipe(map(res => res),
      catchError(response => (Observable.throw(response)
      ))
      );
  }

   httpGetOneDriveDocs(url: string): Observable<HttpResponse<IDocument[]>> {
    return this.http.get<IDocument[]>(url, {observe: 'response'})
    .pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
