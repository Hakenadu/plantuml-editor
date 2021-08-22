import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-permalink',
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.scss']
})
export class PermalinkComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<PermalinkComponent>) {

  }

  ngOnInit(): void {
  }

}
