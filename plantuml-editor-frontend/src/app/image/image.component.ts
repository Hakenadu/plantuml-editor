import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlantumlHolder} from '../shared/plantuml-holder';
import {FormControl} from '@angular/forms';
import {Observable, of, Subscription} from 'rxjs';
import {ConfigService} from '../shared/config.service';
import {MatDialog} from '@angular/material/dialog';
import {PermalinkComponent} from '../permalink/permalink.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';

const ALLOW_OVERFLOW_LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.allow-overflow';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {

  allowOverflow = new FormControl(localStorage.getItem(ALLOW_OVERFLOW_LOCAL_STORAGE_KEY) === 'true');
  private allowOverflowValueChangesSubscription?: Subscription;

  permalinkSupported: Observable<boolean>;

  constructor(public plantumlHolder: PlantumlHolder,
              public configService: ConfigService,
              private matDialog: MatDialog,
              httpClient: HttpClient) {
    this.permalinkSupported = httpClient.get(`${environment.backendUrl}/documents`)
      .pipe(
        map(() => true),
        catchError(error => of(false))
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
    this.matDialog.open(PermalinkComponent);
  }

  get allowOverflowTooltip(): string {
    if (this.allowOverflow.value) {
      return 'uncheck this box to enable the image size limit';
    } else {
      return `check this box to remove the image size limit`;
    }
  }
}
