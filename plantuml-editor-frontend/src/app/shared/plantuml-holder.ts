import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantumlHolder {

  plantuml$ = new BehaviorSubject<string | null>(null);

  set plantuml(plantuml: string | null) {
    this.plantuml$.next(plantuml);
  }

  get plantuml(): string | null {
    return this.plantuml$.value;
  }
}
