import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import ace from 'ace-builds';

const oop = ace.require('ace/lib/oop');
const TextMode = ace.require('ace/mode/text').Mode;
const TextHighlightRules = ace.require('ace/mode/text_highlight_rules').TextHighlightRules;

const CustomHighlightRules = function () {
  // @ts-ignore
  this.$rules = {
    'start': [
      {
        regex: /\b(sometext|othertext)\b/,
        token: 'keyword'
      }
    ]
  };
};

oop.inherits(CustomHighlightRules, TextHighlightRules);

const Mode = function () {
  // @ts-ignore
  this.HighlightRules = CustomHighlightRules;
};
oop.inherits(Mode, TextMode);

(function () {
  // @ts-ignore
  this.$id = 'ace/mode/plantuml';
}).call(Mode.prototype);

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {

  plantuml: string = '';

  @ViewChild('editor')
  editorRef?: ElementRef<HTMLDivElement>;

  constructor() {
  }

  ngOnInit() {
    ace.config.set('basePath', '/assets/ui/');
    ace.config.set('modePath', '');
    ace.config.set('themePath', '');
  }

  ngAfterViewInit(): void {
    if (this.editorRef) {
      const editor = ace.edit(this.editorRef.nativeElement);
      editor.setTheme('ace/theme/eclipse');
      // @ts-ignore
      editor.session.setMode(new Mode);
    }
  }
}

