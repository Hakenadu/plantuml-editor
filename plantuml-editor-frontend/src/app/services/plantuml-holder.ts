import {Injectable} from '@angular/core';
import {BehaviorSubject, of, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {debounce, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

const LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.value';

export type ImageType = 'svg' | 'png';

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
  annotations$ = new BehaviorSubject<Annotation[]>([]);
  private type$ = new BehaviorSubject<ImageType>('svg');

  image?: SafeUrl;
  loading = false;
  valid = true;

  constructor(private httpClient: HttpClient,
              private domSanitizer: DomSanitizer) {

    this.plantuml$.pipe(
      distinctUntilChanged((a, b) => a === b),
      tap(() => this.loading = true),
      debounce(() => timer(500)),
      switchMap(source => {
        if (source === null) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          return of([]);
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, source);
        return this.httpClient.post<Annotation[]>(`${environment.backendUrl}/annotations`, source);
      })
    ).subscribe(annotations => this.annotations$.next(annotations));

    this.annotations$.subscribe(annotations => {
      if (annotations.length === 0) {
        this.valid = true;
        this.updateImage();
      } else {
        this.loading = false;
        this.valid = false;
      }
    });

    this.type$.pipe(
      filter(v => v !== undefined),
      distinctUntilChanged((a, b) => a === b),
      tap(() => this.loading = true)
    ).subscribe(() => this.updateImage());

    const plantumlFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (plantumlFromLocalStorage) {
      this.plantuml = plantumlFromLocalStorage;
    }
  }

  private updateImage() {
    if (!this.valid || !this.type) {
      return;
    }
    if (this.plantuml === null || this.plantuml.trim().length === 0) {
      this.image = undefined;
      this.loading = false;
    } else {
      this.httpClient.post(`${environment.backendUrl}/images/${this.type}`, this.plantuml, {responseType: 'text'})
        .subscribe(dataUri => {
          this.image = this.domSanitizer.bypassSecurityTrustUrl(dataUri);
          this.loading = false;
        });
    }
  }

  set plantuml(plantuml: string | null) {
    this.plantuml$.next(plantuml);
  }

  get plantuml(): string | null {
    return this.plantuml$.value;
  }

  set type(type: ImageType) {
    this.type$.next(type);
  }

  get type(): ImageType {
    return this.type$.value;
  }
}
