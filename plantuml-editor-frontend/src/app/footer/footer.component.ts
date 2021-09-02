import {Component} from '@angular/core';
import {ConfigService} from '../services/config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(public configService: ConfigService) {
  }

}
