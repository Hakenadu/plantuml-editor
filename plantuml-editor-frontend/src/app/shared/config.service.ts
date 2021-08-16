import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {DomSanitizer, SafeHtml, SafeUrl} from '@angular/platform-browser';
import {map} from 'rxjs/operators';

export type IconConfig = MaterialIconConfig | ImgIconConfig;

export interface MaterialIconConfig {
  type: 'material';
  name: string;
}

export interface ImgIconConfig {
  type: 'img';
  src: string | SafeUrl;
  width?: string;
  height?: string;
}

export type FooterActionConfig = PopupFooterActionConfig | LinkFooterActionConfig;

export interface PopupFooterActionConfig {
  type: 'popup';
  icon: IconConfig;
  tooltip?: string;
  content: string | SafeHtml;
}

export interface LinkFooterActionConfig {
  type: 'link';
  icon: IconConfig;
  tooltip?: string;
  href: string | SafeUrl;
}

export interface FooterConfig {
  actions?: FooterActionConfig[];
}

export interface FrontendConfig {
  footer?: FooterConfig;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _config?: FrontendConfig;
  private _config$: Observable<FrontendConfig>;

  constructor(private httpClient: HttpClient,
              private domSanitizer: DomSanitizer) {
    if (environment.configUrl !== undefined && environment.configUrl !== null) {
      this._config$ = this.httpClient.get<FrontendConfig>(`${environment.configUrl}/frontend/`);
    } else { // for local development read config from environment.ts
      const config = environment.config;
      this._config$ = of(config ? <FrontendConfig>config : {});
    }
    this._config$.pipe(map(config => this.sanitize(config))).subscribe(config => this._config = config);
  }

  private sanitize(config: FrontendConfig): FrontendConfig {
    if (!config?.footer?.actions) {
      return config;
    }

    for (const action of config.footer.actions) {
      switch (action.type) {
        case 'popup':
          action.content = this.domSanitizer.bypassSecurityTrustHtml(<string>action.content);
          break;
        case 'link':
          action.href = this.domSanitizer.bypassSecurityTrustUrl(<string>action.href);
          break;
      }
      if (action.icon.type === 'img') {
        action.icon.src = this.domSanitizer.bypassSecurityTrustUrl(<string>action.icon.src)
      }
    }
    return config;
  }

  get config$(): Observable<FrontendConfig> {
    if (this._config) {
      return of(this._config);
    }
    return this._config$;
  }
}
