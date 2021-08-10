import {Injectable} from '@angular/core';
import {PlantumlHolder} from './plantuml-holder';
import {HttpClient} from '@angular/common/http';
import {Observable, of, timer} from 'rxjs';
import {debounce, mergeMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

export interface Annotation {
  row: number;
  type: 'error';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlantumlAnnotationsService {

  annotations$: Observable<Annotation[]>;

  constructor(private plantumlHolder: PlantumlHolder,
              private httpClient: HttpClient) {
    this.annotations$ = this.plantumlHolder.plantuml$.pipe(
      debounce(() => timer(500)),
      mergeMap(source => {
        if (source === null) {
          return of([]);
        }
        return this.httpClient.post<Annotation[]>(`${environment.backendUrl}/annotations`, source);
      })
    );
  }
}
