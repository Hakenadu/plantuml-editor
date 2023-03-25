import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {PlantumlHolder} from '../services/plantuml-holder';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompletionsService {

  apiKey?: string;

  apiEnabled = false;
  remoteApiKeyConfigured = false;

  constructor(private httpClient: HttpClient, private plantumlHolder: PlantumlHolder) {
    this.httpClient.get(`${environment.backendUrl}/completions`).subscribe(response => {
      if (response) {
        this.remoteApiKeyConfigured = true;
      }
      this.apiEnabled = true;
    });
  }

  getCompletion(textualDescription: string): Observable<string> {
    return this.httpClient.post(`${environment.backendUrl}/completions`, {
      originalSpec: this.plantumlHolder.plantuml,
      textualDescription: textualDescription,
      openAiApiKey: this.apiKey
    }, {
      responseType: 'text'
    });
  }
}
