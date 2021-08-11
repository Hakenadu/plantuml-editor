import {Component} from '@angular/core';
import {PlantumlHolder} from '../shared/plantuml-holder';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  constructor(public plantumlHolder: PlantumlHolder) {
  }
}
