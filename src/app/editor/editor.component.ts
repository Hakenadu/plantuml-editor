import {Component, OnInit} from '@angular/core';
import {AceConfigInterface} from 'ngx-ace-wrapper';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public config: AceConfigInterface = {
    mode: 'diagram',
    theme: 'github',
    readOnly: false
  };

  plantuml: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

}
