// @ts-nocheck

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import ace, {Ace} from 'ace-builds';
import {PlantumlHolder} from '../services/plantuml-holder';
import Completer = Ace.Completer;

const oop = ace.require('ace/lib/oop');
const TextMode = ace.require('ace/mode/text').Mode;
const TextHighlightRules = ace.require('ace/mode/text_highlight_rules').TextHighlightRules;

const CustomHighlightRules = function () {


  /*
   * NOTICE: The current rule set is a slightly adapted excerpt from https://github.com/sujoyu/plantuml-previewer
   */
  this.$rules = {
    multilineNote: [
      {
        token: "keyword.control.source.wsd",
        regex: /\bend note\b/,
        next: "start"
      },
      {
        token: "string.quoted.double.source.wsd",
        regex: /.*$/
      },
      {
        defaultToken: "string.quoted.double.source.wsd"
      }
    ],
    start: [
      {
        token: "variable.source.wsd",
        regex: /#[^\s]+/
      },
      {
        token: "keyword.control.source.wsd",
        regex: /(?:-|\.)+>|<\s*(?:-|\.)+|(?:-|\.)+(?:x|o|\||\[|]|>|\||\\)(?!\||>)|(?:-|\.)+\|>|(?:-|\.)+<\||<\|(?:-|\.)+|(?:-|\.)+(?!\||>)/,
      },
      {
        token: "keyword.control.source.wsd",
        regex: /{|}/,
      },
      {
        token: "string.quoted.double.source.wsd",
        regex: /(?:\:)(.*)$/
      },
      {
        token: "keyword.control.source.wsd",
        regex: /\bnote\b(?:(?!:[^:]*|as\s+\w).)*$/,
        next: "multilineNote"
      },
      {
        token: "keyword.control.source.wsd",
        regex: /\bend note\b/,
        next: "start"
      },
      {
        token: "comment.line.source.wsd",
        regex: /^@(?:start|end)[^]*$/,
      },
      {
        token: "support.function.source.wsd",
        regex: /\b(?:abstract|actor|class|component|database|enum|interface|object|participant|state|usecase)\b/
      },
      {
        token: "keyword.control.source.wsd",
        regex: /\b(?:@enduml|@startuml|activate|again|also|alt|as|autonumber|bottom|box|break|center|create|critical|deactivate|destroy|down|else|end|endif|endwhile|footbox|footer|fork|group|header|hide|if|is|left|link|loop|namespace|newpage|note|of|on|opt|over|package|page|par|partition|ref|repeat|return|right|rotate|show|skin|skinparam|start|stop|title|top|top to bottom direction|up|while)\b/
      },
      {
        token: "variable.source.wsd",
        regex: /\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGray|DarkGreen|DarkGrey|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGray|DarkSlateGrey|DarkTurquoise|DarkViolet|Darkorange|DeepPink|DeepSkyBlue|DimGray|DimGrey|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gray|Green|GreenYellow|Grey|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGray|LightGreen|LightGrey|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGray|LightSlateGrey|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGray|SlateGrey|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/
      },
    ]
  };
};

oop.inherits(CustomHighlightRules, TextHighlightRules);

const Mode = function () {
  this.HighlightRules = CustomHighlightRules;
};
oop.inherits(Mode, TextMode);

(function () {
  this.$id = 'ace/mode/plantuml';
}).call(Mode.prototype);

const staticPlantumlCompleter: Completer = {
  getCompletions: (editor, session, pos, prefix, callback) => {
    const wordList = ['abstract', 'actor', 'class', 'component', 'database', 'enum', 'interface', 'object', 'participant', 'state', 'usecase'];
    callback(null, wordList.map(word => {
      return {
        caption: word,
        value: word,
        meta: 'static'
      };
    }));
  }
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit, AfterViewInit {

  private editor: Ace.Editor;

  @ViewChild('editor')
  editorRef?: ElementRef<HTMLDivElement>;

  constructor(private plantumlHolder: PlantumlHolder) {

  }

  ngOnInit() {
    ace.config.set('basePath', '/assets/ui/');
    ace.config.set('modePath', '');
    ace.config.set('themePath', '');
  }

  ngAfterViewInit(): void {
    if (this.editorRef) {

      this.editor = ace.edit(this.editorRef.nativeElement);
      this.editor.setTheme('ace/theme/monokai');
      this.editor.session.setMode(new Mode);
      this.editor.completers = [staticPlantumlCompleter];
      this.editor.setOptions({
        enableBasicAutocompletion: true
      });

      this.editor.session.on('change', () => {
        this.plantumlHolder.plantuml = this.editor.getValue();
      });

      this.plantumlHolder.annotations$.subscribe(annotations => {
        this.editor.session.setAnnotations(annotations);
      });

      if (this.plantumlHolder.plantuml !== null) {
        this.editor.setValue(this.plantumlHolder.plantuml, 1);
      }

      this.plantumlHolder.plantuml$.subscribe(plantuml => {
        const cleanPlantuml = plantuml || '';
        if (cleanPlantuml !== this.editor.getValue()) {
          this.editor.setValue(cleanPlantuml, 1);
        }
      });
    }
  }

  onResized($event: ResizeObserverEntry) {
    if (this.editor) {
      const newContainerHeight = `${$event.contentRect.height}px`;
      const newContainerWidth = `${$event.contentRect.width}px`;

      if (this.editor.container.style.height === newContainerHeight
        && this.editor.container.style.width === newContainerWidth) {
        return;
      }

      this.editor.container.style.width = newContainerWidth;
      this.editor.container.style.height = newContainerHeight;
      this.editor.resize();
    }
  }
}

