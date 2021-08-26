import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../shared/config.service';

const LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.storages';

@Component({
  selector: 'app-permalink',
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.scss']
})
export class PermalinkComponent {


  constructor(public matDialogRef: MatDialogRef<PermalinkComponent>,
              public configService: ConfigService) {
  }
}
