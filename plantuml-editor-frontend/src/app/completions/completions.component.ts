import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CompletionsService} from './completions.service';
import {MatDialog} from '@angular/material/dialog';
import {ApiKeySettingsComponent} from './api-key-settings/api-key-settings.component';
import {PlantumlHolder} from '../services/plantuml-holder';

@Component({
  selector: 'app-completions',
  templateUrl: './completions.component.html',
  styleUrls: ['./completions.component.scss']
})
export class CompletionsComponent {

  textualDescription = new FormControl(null, Validators.required);
  loading = false;
  error = false;

  constructor(public completionService: CompletionsService, private plantumlHolder: PlantumlHolder, private matDialog: MatDialog) {
  }

  openApiKeyModal() {
    this.matDialog.open(ApiKeySettingsComponent);
  }

  runCompletion() {
    this.error = false;
    this.loading = true;
    this.completionService.getCompletion(this.textualDescription.value).subscribe(completion => {
      this.plantumlHolder.plantuml = completion;
      this.textualDescription.setValue('');
      this.loading = false;
    }, error => {
      this.error = true;
      this.loading = false;
    });
  }
}
