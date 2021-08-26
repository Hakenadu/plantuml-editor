import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../shared/config.service';
import {DocumentService} from './document.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';

const LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.storages';

@Component({
  selector: 'app-permalink',
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.scss']
})
export class PermalinkComponent {

  permalink?: string;
  loading = false;

  constructor(public matDialogRef: MatDialogRef<PermalinkComponent>,
              public configService: ConfigService,
              public documentService: DocumentService,
              private clipboard: Clipboard,
              private matSnackbar: MatSnackBar) {
  }

  generatePermalink() {
    this.loading = true;
    this.documentService.createDocument().subscribe(uuid => {
      this.permalink = `${window.location.href}?document=${uuid}`;
      this.copyPermalinkToClipboard();
      this.loading = false;
    });
  }

  copyPermalinkToClipboard() {
    if (!this.permalink) {
      throw new Error('no permalink to copy');
    }
    this.clipboard.copy(this.permalink);
    this.matSnackbar.open('copied permalink to clipboard', 'OK', {
      horizontalPosition: 'end',
      duration: 3500
    });
  }
}
