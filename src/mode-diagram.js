ace.define("ace/mode/diagram_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
  "use strict";
  var r = e("../lib/oop"), i = e("./text_highlight_rules").TextHighlightRules, s = function () {
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
    }, this.normalizeRules()
  };
  s.metaData = {
    fileTypes: ["wsd"],
    name: "Diagram",
    scopeName: "source.wsd"
  }, r.inherits(s, i), t.DiagramHighlightRules = s
}), ace.define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (e, t, n) {
  "use strict";
  var r = e("../../lib/oop"), i = e("../../range").Range, s = e("./fold_mode").FoldMode, o = t.FoldMode = function (e) {
    e && (this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)), this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)))
  };
  r.inherits(o, s), function () {
    this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/, this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/, this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/, this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/, this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/, this._getFoldWidgetBase = this.getFoldWidget, this.getFoldWidget = function (e, t, n) {
      var r = e.getLine(n);
      if (this.singleLineBlockCommentRe.test(r) && !this.startRegionRe.test(r) && !this.tripleStarBlockCommentRe.test(r)) return "";
      var i = this._getFoldWidgetBase(e, t, n);
      return !i && this.startRegionRe.test(r) ? "start" : i
    }, this.getFoldWidgetRange = function (e, t, n, r) {
      var i = e.getLine(n);
      if (this.startRegionRe.test(i)) return this.getCommentRegionBlock(e, i, n);
      var s = i.match(this.foldingStartMarker);
      if (s) {
        var o = s.index;
        if (s[1]) return this.openingBracketBlock(e, s[1], n, o);
        var u = e.getCommentFoldRange(n, o + s[0].length, 1);
        return u && !u.isMultiLine() && (r ? u = this.getSectionRange(e, n) : t != "all" && (u = null)), u
      }
      if (t === "markbegin") return;
      var s = i.match(this.foldingStopMarker);
      if (s) {
        var o = s.index + s[0].length;
        return s[1] ? this.closingBracketBlock(e, s[1], n, o) : e.getCommentFoldRange(n, o, -1)
      }
    }, this.getSectionRange = function (e, t) {
      var n = e.getLine(t), r = n.search(/\S/), s = t, o = n.length;
      t += 1;
      var u = t, a = e.getLength();
      while (++t < a) {
        n = e.getLine(t);
        var f = n.search(/\S/);
        if (f === -1) continue;
        if (r > f) break;
        var l = this.getFoldWidgetRange(e, "all", t);
        if (l) {
          if (l.start.row <= s) break;
          if (l.isMultiLine()) t = l.end.row; else if (r == f) break
        }
        u = t
      }
      return new i(s, o, u, e.getLine(u).length)
    }, this.getCommentRegionBlock = function (e, t, n) {
      var r = t.search(/\s*$/), s = e.getLength(), o = n, u = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/, a = 1;
      while (++n < s) {
        t = e.getLine(n);
        var f = u.exec(t);
        if (!f) continue;
        f[1] ? a-- : a++;
        if (!a) break
      }
      var l = n;
      if (l > o) return new i(o, r, l, t.length)
    }
  }.call(o.prototype)
}), ace.define("ace/mode/diagram", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/diagram_highlight_rules", "ace/mode/folding/cstyle"], function (e, t, n) {
  "use strict";
  var r = e("../lib/oop"), i = e("./text").Mode, s = e("./diagram_highlight_rules").DiagramHighlightRules,
    o = e("./folding/cstyle").FoldMode, u = function () {
      this.HighlightRules = s, this.foldingRules = new o
    };
  r.inherits(u, i), function () {
    this.$id = "ace/mode/diagram"
  }.call(u.prototype), t.Mode = u
})
