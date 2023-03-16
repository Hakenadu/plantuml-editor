import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../services/config.service';
import {DocumentService} from '../services/document.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, Validators} from '@angular/forms';
import {environment} from '../../environments/environment';
import {merge, Subscription} from 'rxjs';

@Component({
  templateUrl: './share.component.html'
})
export class ShareComponent implements OnInit, OnDestroy {

  link?: string;
  loading = false;

  key = new FormControl(this.createDefaultKey(8), Validators.required);

  imageOnlyLink = new FormControl(false);
  imageType = new FormControl('svg');

  imageFullsize = new FormControl(false);

  private resetLinkSubscription?: Subscription;

  constructor(public matDialogRef: MatDialogRef<ShareComponent>,
              public configService: ConfigService,
              public documentService: DocumentService,
              private clipboard: Clipboard,
              private matSnackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.resetLinkSubscription = merge(
      this.imageOnlyLink.valueChanges,
      this.imageType.valueChanges,
      this.imageFullsize.valueChanges
    ).subscribe(() => {
      this.link = undefined;
    });
  }

  ngOnDestroy() {
    this.resetLinkSubscription?.unsubscribe();
  }

  generateLink() {
    this.loading = true;

    const keySnapshot = this.key.value;
    this.documentService.createDocument(keySnapshot).subscribe(uuid => {
      if (this.imageOnlyLink.value) {
        this.link = `${environment.backendUrl}/documents/${uuid}/images/${this.imageType.value}?key=${keySnapshot}`;
      } else {
        let baseUrl = location.protocol + '//' + location.host + location.pathname;
        if (baseUrl.endsWith('/')) {
          baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        }
        this.link = `${baseUrl}?document-id=${uuid}&document-key=${keySnapshot}`;

        if (this.imageFullsize.value) {
          this.link += '&split-position=0'
        }
      }

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

  createDefaultKey(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    let result = '';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
}
