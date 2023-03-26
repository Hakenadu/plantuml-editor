import {Component, OnInit} from '@angular/core';
import {CompletionsService} from '../completions.service';

@Component({
  selector: 'app-api-key-settings',
  templateUrl: './api-key-settings.component.html'
})
export class ApiKeySettingsComponent {

  constructor(public completionsService: CompletionsService) {
  }
}
