import {Component} from '@angular/core';
import {ConfigService} from '../services/config.service';
import {CompletionsService} from '../completions/completions.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(public configService: ConfigService, public completionsService: CompletionsService) {
  }
}
