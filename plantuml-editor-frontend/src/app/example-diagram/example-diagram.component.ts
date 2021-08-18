import {Component, Input} from '@angular/core';
import {PlantumlHolder} from '../shared/plantuml-holder';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-example-diagram',
  templateUrl: './example-diagram.component.html',
  styleUrls: ['./example-diagram.component.scss']
})
export class ExampleDiagramComponent {

  @Input()
  title?: string;

  @Input()
  type?: string;

  constructor(private plantumlHolder: PlantumlHolder,
              private httpClient: HttpClient) {

  }

  simpleClicked(): void {
    this.insertPlantumlExample('simple');
  }

  extendedClicked(): void {
    this.insertPlantumlExample('extended');
  }

  private insertPlantumlExample(id: string): void {
    this.httpClient.get(`${this.basePath}/${id}.pu`, {
      responseType: 'text'
    }).subscribe(plantuml => this.plantumlHolder.plantuml = plantuml);
  }

  get basePath(): string {
    return `assets/example-diagrams/${this.type}`;
  }

  get logoSrc(): string {
    return `${this.basePath}/logo.svg`;
  }
}
