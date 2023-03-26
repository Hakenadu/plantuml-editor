import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlantumlHolder} from '../services/plantuml-holder';
import {UntypedFormControl} from '@angular/forms';
import {Observable, of, Subscription} from 'rxjs';
import {ConfigService} from '../services/config.service';
import {MatDialog} from '@angular/material/dialog';
import {ShareComponent} from '../share/share.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';

const ALLOW_OVERFLOW_LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.allow-overflow';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {

  allowOverflow = new UntypedFormControl(localStorage.getItem(ALLOW_OVERFLOW_LOCAL_STORAGE_KEY) === 'true');
  private allowOverflowValueChangesSubscription?: Subscription;

  sharingSupported: Observable<boolean>;

  constructor(private logger: NGXLogger,
              public plantumlHolder: PlantumlHolder,
              public configService: ConfigService,
              private matDialog: MatDialog,
              httpClient: HttpClient) {
    this.sharingSupported = httpClient.get(
      `${environment.backendUrl}/documents`,
      {responseType: 'text'}
    )
      .pipe(
        catchError(error => {
          this.logger.info('/documents route is disabled, disabling links');
          return of(false);
        }),
        map(() => true)
      );
  }

  ngOnInit() {
    this.allowOverflowValueChangesSubscription = this.allowOverflow.valueChanges
      .subscribe(allowOverflow => localStorage.setItem(ALLOW_OVERFLOW_LOCAL_STORAGE_KEY, allowOverflow));
  }

  ngOnDestroy() {
    this.allowOverflowValueChangesSubscription?.unsubscribe();
  }

  onShareClicked() {
    this.matDialog.open(ShareComponent);
  }

  get allowOverflowTooltip(): string {
    if (this.allowOverflow.value) {
      return 'uncheck this box to enable the image size limit';
    } else {
      return `check this box to remove the image size limit`;
    }
  }
}
