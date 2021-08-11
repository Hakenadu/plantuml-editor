import {Injectable} from '@angular/core';
import {PlantumlHolder} from './plantuml-holder';

const LOCAL_STORAGE_KEY = 'plantuml.mseiche.de-spec';

@Injectable({
  providedIn: 'root'
})
export class PlantumlStore {

  constructor(private plantumlHolder: PlantumlHolder) {
    this.plantumlHolder.plantuml = localStorage.getItem(LOCAL_STORAGE_KEY);
    this.plantumlHolder.plantuml$.subscribe(plantuml => {
      if (plantuml === null) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, plantuml);
      }
    });
  }
}
