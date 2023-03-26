import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {PlantumlHolder} from '../services/plantuml-holder';
import {Observable} from 'rxjs';

const API_KEY_LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.completions.api-key';
const ALLOW_LOCAL_API_KEY_LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.completions.allow-local-api-key';

@Injectable({
  providedIn: 'root'
})
export class CompletionsService {

  private _apiKey?: string;

  apiEnabled = false;
  remoteApiKeyConfigured = false;
  allowLocalApiKey = false;

  constructor(private httpClient: HttpClient, private plantumlHolder: PlantumlHolder) {
    this.httpClient.get(`${environment.backendUrl}/completions`).subscribe(response => {
      if (response) {
        this.remoteApiKeyConfigured = true;
      }
      this.apiEnabled = true;
    });

    const storedApiKey = localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY);
    if (storedApiKey) {
      this.apiKey = storedApiKey;
    }

    const allowLocalApiKey = localStorage.getItem(ALLOW_LOCAL_API_KEY_LOCAL_STORAGE_KEY);
    if ('true' === allowLocalApiKey) {
      this.allowLocalApiKey = true;
    }
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

  set apiKey(apiKey: string | undefined) {
    this._apiKey = apiKey;

    if (apiKey) {
      localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(API_KEY_LOCAL_STORAGE_KEY);
    }
  }

  get apiKey(): string | undefined {
    return this._apiKey;
  }
}
