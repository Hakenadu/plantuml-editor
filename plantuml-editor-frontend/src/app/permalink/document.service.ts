import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlantumlHolder} from '../shared/plantuml-holder';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private plantumlHolder: PlantumlHolder,
              private httpClient: HttpClient) {
  }

  createDocument(): Observable<string> {
    return this.httpClient.post<string>(`${environment.backendUrl}/documents`, this.plantumlHolder.plantuml);
  }

  getDocument(id: string): Observable<string> {
    return this.httpClient.get(`${environment.backendUrl}/documents/${id}`, {responseType: 'text'});
  }
}
