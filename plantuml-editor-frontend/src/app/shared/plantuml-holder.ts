import {Injectable} from '@angular/core';
import {BehaviorSubject, merge, Observable, of, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {debounce, mergeMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

export interface Annotation {
  row: number;
  type: 'error';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlantumlHolder {

  plantuml$ = new BehaviorSubject<string | null>(null);
  status$ = new BehaviorSubject<'valid' | 'invalid' | 'pending'>('pending');
  type$ = new BehaviorSubject<'svg' | 'png'>('svg');
  annotations$: Observable<Annotation[]>;
  image?: SafeUrl;

  constructor(private httpClient: HttpClient,
              private domSanitizer: DomSanitizer) {
    this.annotations$ = this.plantuml$.pipe(
      debounce(() => timer(500)),
      mergeMap(source => {
        if (source === null) {
          return of([]);
        }
        return this.httpClient.post<Annotation[]>(`${environment.backendUrl}/api/annotations`, source);
      })
    );
    this.annotations$.subscribe(annotations => {
      if (annotations.length === 0) {
        this.status$.next('valid');
      } else {
        this.status$.next('invalid');
      }
    });
    merge(this.type$, this.status$).subscribe(() => this.updateImage());
  }

  private updateImage() {
    if (this.status$.value !== 'valid' || !this.type$.value) {
      return;
    }
    if (this.plantuml === null || this.plantuml.trim().length === 0) {
      this.image = undefined;
    } else {
      this.httpClient.post(`${environment.backendUrl}/api/images/${this.type$.value}`, this.plantuml, {responseType: 'text'})
        .subscribe(dataUri => {
          this.image = this.domSanitizer.bypassSecurityTrustUrl(dataUri);
        });
    }
  }

  set plantuml(plantuml: string | null) {
    this.status$.next('pending');
    this.plantuml$.next(plantuml);
  }

  get plantuml(): string | null {
    return this.plantuml$.value;
  }

  set type(type: 'svg' | 'png') {
    this.type$.next(type);
  }

  get type(): 'svg' | 'png' {
    return this.type$.value;
  }
}
