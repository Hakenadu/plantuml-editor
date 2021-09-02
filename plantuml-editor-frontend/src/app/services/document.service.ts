import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlantumlHolder} from './plantuml-holder';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private plantumlHolder: PlantumlHolder,
              private httpClient: HttpClient) {
  }

  createDocument(key: string): Observable<string> {
    return this.httpClient.post<string>(`${environment.backendUrl}/documents`, {
      source: this.plantumlHolder.plantuml,
      key
    });
  }

  getDocument(id: string, key: string): Observable<string> {
    return this.httpClient.post(`${environment.backendUrl}/documents/${id}`,
      {key},
      {responseType: 'text'}
    );
  }
}
