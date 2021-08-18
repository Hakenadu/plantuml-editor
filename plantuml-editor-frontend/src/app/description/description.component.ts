import {Component, Input} from '@angular/core';
import {PlantumlHolder} from '../shared/plantuml-holder';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html'
})
export class DescriptionComponent {

  @Input()
  scrollDirection?: 'horizontal' | 'vertical';

  exampleDiagramEntries: { type: string, title: string }[] = [
    {type: 'sequence-diagram', title: 'Sequence Diagram'},
    {type: 'sequence-diagram', title: 'Sequence Diagram'},
    {type: 'sequence-diagram', title: 'Sequence Diagram'}
  ];

  constructor(public plantumlHolder: PlantumlHolder) {

  }
}
