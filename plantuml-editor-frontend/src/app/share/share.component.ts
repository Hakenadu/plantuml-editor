import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../shared/config.service';
import {DocumentService} from './document.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  templateUrl: './share.component.html'
})
export class ShareComponent {

  link?: string;
  loading = false;

  constructor(public matDialogRef: MatDialogRef<ShareComponent>,
              public configService: ConfigService,
              public documentService: DocumentService,
              private clipboard: Clipboard,
              private matSnackbar: MatSnackBar) {
  }

  generateLink() {
    this.loading = true;
    this.documentService.createDocument().subscribe(uuid => {
      this.link = `${window.location.href}?document=${uuid}`;
      this.copyLinkToClipboard();
      this.loading = false;
    });
  }

  copyLinkToClipboard() {
    if (!this.link) {
      throw new Error('no share to copy');
    }
    this.clipboard.copy(this.link);
    this.matSnackbar.open('copied link to clipboard', 'OK', {
      horizontalPosition: 'end',
      duration: 3500
    });
  }
}
