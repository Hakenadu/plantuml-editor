import {Component} from '@angular/core';
import {CompletionsService} from '../completions.service';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-api-key-settings',
  templateUrl: './api-key-settings.component.html'
})
export class ApiKeySettingsComponent {

  constructor(public completionsService: CompletionsService, public configService: ConfigService) {
  }
}
