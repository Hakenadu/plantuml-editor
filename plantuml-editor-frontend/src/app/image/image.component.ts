import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlantumlHolder} from '../shared/plantuml-holder';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

const ALLOW_OVERFLOW_LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.allow-overflow';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {

  allowOverflow = new FormControl(localStorage.getItem(ALLOW_OVERFLOW_LOCAL_STORAGE_KEY) === 'true');
  private allowOverflowValueChangesSubscription?: Subscription;

  constructor(public plantumlHolder: PlantumlHolder) {

  }

  ngOnInit() {
    this.allowOverflowValueChangesSubscription = this.allowOverflow.valueChanges
      .subscribe(allowOverflow => localStorage.setItem(ALLOW_OVERFLOW_LOCAL_STORAGE_KEY, allowOverflow));
  }

  ngOnDestroy() {
    this.allowOverflowValueChangesSubscription?.unsubscribe();
  }
}
