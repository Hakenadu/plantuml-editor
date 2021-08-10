// @ts-nocheck

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import ace from 'ace-builds';
import {PlantumlAnnotationsService} from '../shared/plantuml-annotations.service';
import {PlantumlHolder} from '../shared/plantuml-holder';

const oop = ace.require('ace/lib/oop');
const TextMode = ace.require('ace/mode/text').Mode;
const TextHighlightRules = ace.require('ace/mode/text_highlight_rules').TextHighlightRules;

const CustomHighlightRules = function () {
  this.$rules = {
    start: [{
      token: "comment.line.source.wsd",
      regex: /^(?:#|')/,
      push: [{token: "comment.line.source.wsd", regex: /$/, next: "pop"}, {defaultToken: "comment.line.source.wsd"}]
    }, {
      token: "support.function.source.wsd",
      regex: /\b(?:abstract|actor|class|component|enum|interface|object|participant|state|usecase)\b/
    }, {
      token: "keyword.control.source.wsd",
      regex: /\btitle\b/,
      push: [{
        token: "string.quoted.double.source.wsd",
        regex: /$/,
        next: "pop"
      }, {defaultToken: "string.quoted.double.source.wsd"}]
    }, {
      token: "keyword.control.source.wsd",
      regex: /\b(?:@enduml|@startuml|activate|again|also|alt|as|autonumber|bottom|box|break|center|create|critical|deactivate|destroy|down|else|end|endif|endwhile|footbox|footer|fork|group|header|hide|if|is|left|link|loop|namespace|newpage|note|of|on|opt|over|package|page|par|partition|ref|repeat|return|right|rotate|show|skin|skinparam|start|stop|title|top|top to bottom direction|up|while)\b/
    }, {
      token: "variable.source.wsd",
      regex: /\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGray|DarkGreen|DarkGrey|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGray|DarkSlateGrey|DarkTurquoise|DarkViolet|Darkorange|DeepPink|DeepSkyBlue|DimGray|DimGrey|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gray|Green|GreenYellow|Grey|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGray|LightGreen|LightGrey|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGray|LightSlateGrey|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGray|SlateGrey|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/
    }, {
      token: ["constant.string.source.wsd", "string.quoted.double.source.wsd", "keyword.control.source.wsd", "string.quoted.double.source.wsd", "constant.string.source.wsd", "string.quoted.double.source.wsd"],
      regex: /([A-Za-z_0-9]+)( +)(-?->|<-?-)( +)([A-Za-z_0-9]+)(:)/,
      push: [{
        token: "string.quoted.double.source.wsd",
        regex: /$/,
        next: "pop"
      }, {defaultToken: "string.quoted.double.source.wsd"}]
    }, {
      token: "string.quoted.double.source.wsd",
      regex: /"/,
      push: [{
        token: "string.quoted.double.source.wsd",
        regex: /"/,
        next: "pop"
      }, {defaultToken: "string.quoted.double.source.wsd"}]
    }, {
      token: "string.quoted.single.source.wsd",
      regex: /'/,
      push: [{
        token: "string.quoted.single.source.wsd",
        regex: /'/,
        next: "pop"
      }, {defaultToken: "string.quoted.single.source.wsd"}]
    }, {
      token: "constant.string.source.wsd",
      regex: /\b[A-Z]+[A-Za-z_0-9]*\b/
    }, {token: "variable.parameter.source.wsd", regex: /\b[a-z_]+[A-Za-z_0-9]*\b/}]
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

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {

  private editor: Ace.Editor;
  plantuml: string = '';

  @ViewChild('editor')
  editorRef?: ElementRef<HTMLDivElement>;

  constructor(private plantumlHolder: PlantumlHolder,
              private annotationsService: PlantumlAnnotationsService) {
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
      this.editor.session.on('change', () => {
        this.plantumlHolder.plantuml = this.editor.getValue();
      });
      this.annotationsService.annotations$.subscribe(annotations => {
        this.editor.session.setAnnotations(annotations);
      });
    }
  }
}
