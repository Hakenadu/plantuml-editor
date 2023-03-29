import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlantumlHolder} from './plantuml-holder';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  documentsApiEnabled?: boolean;
  documentsOverridingEnabled?: boolean;

  currentDocumentId?: string;
  currentDocumentKey?: string;
  currentDocumentBasePlantuml?: string;

  constructor(private plantumlHolder: PlantumlHolder,
              private httpClient: HttpClient) {
    this.determineDocumentsOverridingEnabled().subscribe(overridingEnabled => {
      this.documentsOverridingEnabled = overridingEnabled;
      this.documentsApiEnabled = true;
    }, error => this.documentsApiEnabled = false);
  }

  private determineDocumentsOverridingEnabled(): Observable<boolean> {
    return this.httpClient.get(`${environment.backendUrl}/documents`, {
      responseType: 'text'
    }).pipe(
      map(response => 'true' === response)
    );
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

  setDocument(id: string, key: string): Observable<boolean> {
    return this.httpClient.put(`${environment.backendUrl}/documents/${id}`, {
      source: this.plantumlHolder.plantuml,
      key
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
