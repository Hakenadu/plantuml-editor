import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../services/config.service';
import {DocumentService} from '../services/document.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UntypedFormControl, Validators} from '@angular/forms';
import {environment} from '../../environments/environment';
import {merge, Subscription} from 'rxjs';
import {PlantumlHolder} from '../services/plantuml-holder';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './share.component.html'
})
export class ShareComponent implements OnInit, OnDestroy {

  link?: string;
  loading = false;

  key = new UntypedFormControl(this.createDefaultKey(8), Validators.required);

  imageOnlyLink = new UntypedFormControl(false);
  imageType = new UntypedFormControl('svg');

  imageFullsize = new UntypedFormControl(false);

  private resetLinkSubscription?: Subscription;

  constructor(public matDialogRef: MatDialogRef<ShareComponent>,
              public configService: ConfigService,
              public documentService: DocumentService,
              private plantumlHolder: PlantumlHolder,
              private clipboard: Clipboard,
              private matSnackbar: MatSnackBar,
              private activatedRoute: ActivatedRoute) {
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

  overrideDocument() {
    this.documentService.getDocument(this.documentService.currentDocumentId!, this.documentService.currentDocumentKey!).subscribe(plantuml => {
      if (plantuml !== this.documentService.currentDocumentBasePlantuml) {
        this.matSnackbar.open('document changed in the meantime => overriding failed', 'OK', {
          horizontalPosition: 'end',
          duration: 3500
        });
      } else {
        this.documentService.setDocument(this.documentService.currentDocumentId!, this.documentService.currentDocumentKey!).subscribe(success => {
          let message = '';
          if (success) {
            message = 'document was successfully overridden';
          } else {
            message = 'overriding failed';
          }
          this.matSnackbar.open(message, 'OK', {
            horizontalPosition: 'end',
            duration: 3500
          });
        });
      }
    });
  }

  generateLink() {
    this.loading = true;

    let baseUrl = location.protocol + '//' + location.host + location.pathname;
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }

    if (this.documentService.documentsApiEnabled) {
      this.generateDocumentLink(baseUrl);
    } else {
      this.generateBase64Link(baseUrl);
    }
  }

  private generateDocumentLink(baseUrl: string) {
    const keySnapshot = this.key.value;
    this.documentService.createDocument(keySnapshot).subscribe(uuid => {
      if (this.imageOnlyLink.value) {
        this.link = new URL(
          `${environment.backendUrl}/documents/${uuid}/images/${this.imageType.value}?key=${keySnapshot}`,
          baseUrl
        ).href;
      } else {
        this.link = `${baseUrl}?document-id=${uuid}&document-key=${keySnapshot}`;

        if (this.imageFullsize.value) {
          this.link += '&split-position=0'
        }
      }

      this.copyLinkToClipboard();
      this.loading = false;
    });
  }

  private generateBase64Link(baseUrl: string) {
    const documentSource = btoa(this.plantumlHolder.plantuml || '');
    if (this.imageOnlyLink.value) {
      this.link = new URL(
        `${environment.backendUrl}/images/${this.imageType.value}?source=${documentSource}`,
        baseUrl
      ).href;
    } else {
      this.link = `${baseUrl}?document-source=${documentSource}`;
      if (this.imageFullsize.value) {
        this.link += '&split-position=0'
      }
    }
    this.copyLinkToClipboard();
    this.loading = false;
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


  get overrideButtonVisible(): boolean {
    return this.documentService.documentsOverridingEnabled === true && this.documentService.currentDocumentId !== undefined && this.documentService.currentDocumentKey !== undefined;
  }
}
