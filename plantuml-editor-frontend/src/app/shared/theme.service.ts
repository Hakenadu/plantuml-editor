import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

const LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.primary-theme';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  primaryTheme$ = new BehaviorSubject<Theme>(localStorage.getItem(LOCAL_STORAGE_KEY) === 'light' ? 'light' : 'dark');

  set primaryTheme(primaryTheme: Theme) {
    this.primaryTheme$.next(primaryTheme);
    localStorage.setItem(LOCAL_STORAGE_KEY, primaryTheme);
  }

  get primaryTheme(): Theme {
    return this.primaryTheme$.value;
  }

  get secondaryTheme(): Theme {
    return this.primaryTheme === 'light' ? 'dark' : 'light';
  }
}
