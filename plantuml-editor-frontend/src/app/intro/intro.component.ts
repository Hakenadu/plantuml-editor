import {Component, Input} from '@angular/core';
import {PlantumlHolder} from '../services/plantuml-holder';
import {ConfigService} from '../services/config.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html'
})
export class IntroComponent {

  @Input()
  scrollDirection?: 'horizontal' | 'vertical';

  exampleDiagramEntries: { type: string, title: string }[] = [
    {type: 'class-diagram', title: 'Class Diagram'},
    {type: 'component-diagram', title: 'Component Diagram'},
    {type: 'sequence-diagram', title: 'Sequence Diagram'},
    {type: 'use-case-diagram', title: 'Use Case Diagram'}
  ];

  constructor(public plantumlHolder: PlantumlHolder,
              public configService: ConfigService) {

  }
}
