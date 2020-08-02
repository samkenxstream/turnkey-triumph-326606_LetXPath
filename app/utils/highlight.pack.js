/*
  Highlight.js 10.1.1 (93fd0d73)
  License: BSD-3-Clause
  Copyright (c) 2006-2020, Ivan Sagalaev
*/
var hljs = (function () {
  "use strict";
  function e(n) {
    Object.freeze(n);
    var t = "function" == typeof n;
    return (
      Object.getOwnPropertyNames(n).forEach(function (r) {
        !Object.hasOwnProperty.call(n, r) ||
          null === n[r] ||
          ("object" != typeof n[r] && "function" != typeof n[r]) ||
          (t && ("caller" === r || "callee" === r || "arguments" === r)) ||
          Object.isFrozen(n[r]) ||
          e(n[r]);
      }),
      n
    );
  }
  class n {
    constructor(e) {
      void 0 === e.data && (e.data = {}), (this.data = e.data);
    }
    ignoreMatch() {
      this.ignore = !0;
    }
  }
  function t(e) {
    return e
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }
  function r(e, ...n) {
    var t = {};
    for (const n in e) t[n] = e[n];
    return (
      n.forEach(function (e) {
        for (const n in e) t[n] = e[n];
      }),
      t
    );
  }
  function a(e) {
    return e.nodeName.toLowerCase();
  }
  var i = Object.freeze({
    __proto__: null,
    escapeHTML: t,
    inherit: r,
    nodeStream: function (e) {
      var n = [];
      return (
        (function e(t, r) {
          for (var i = t.firstChild; i; i = i.nextSibling)
            3 === i.nodeType
              ? (r += i.nodeValue.length)
              : 1 === i.nodeType &&
                (n.push({ event: "start", offset: r, node: i }),
                (r = e(i, r)),
                a(i).match(/br|hr|img|input/) ||
                  n.push({ event: "stop", offset: r, node: i }));
          return r;
        })(e, 0),
        n
      );
    },
    mergeStreams: function (e, n, r) {
      var i = 0,
        s = "",
        o = [];
      function l() {
        return e.length && n.length
          ? e[0].offset !== n[0].offset
            ? e[0].offset < n[0].offset
              ? e
              : n
            : "start" === n[0].event
            ? e
            : n
          : e.length
          ? e
          : n;
      }
      function c(e) {
        s +=
          "<" +
          a(e) +
          [].map
            .call(e.attributes, function (e) {
              return " " + e.nodeName + '="' + t(e.value) + '"';
            })
            .join("") +
          ">";
      }
      function u(e) {
        s += "</" + a(e) + ">";
      }
      function d(e) {
        ("start" === e.event ? c : u)(e.node);
      }
      for (; e.length || n.length; ) {
        var g = l();
        if (
          ((s += t(r.substring(i, g[0].offset))), (i = g[0].offset), g === e)
        ) {
          o.reverse().forEach(u);
          do {
            d(g.splice(0, 1)[0]), (g = l());
          } while (g === e && g.length && g[0].offset === i);
          o.reverse().forEach(c);
        } else
          "start" === g[0].event ? o.push(g[0].node) : o.pop(),
            d(g.splice(0, 1)[0]);
      }
      return s + t(r.substr(i));
    },
  });
  const s = "</span>",
    o = (e) => !!e.kind;
  class l {
    constructor(e, n) {
      (this.buffer = ""), (this.classPrefix = n.classPrefix), e.walk(this);
    }
    addText(e) {
      this.buffer += t(e);
    }
    openNode(e) {
      if (!o(e)) return;
      let n = e.kind;
      e.sublanguage || (n = `${this.classPrefix}${n}`), this.span(n);
    }
    closeNode(e) {
      o(e) && (this.buffer += s);
    }
    value() {
      return this.buffer;
    }
    span(e) {
      this.buffer += `<span class="${e}">`;
    }
  }
  class c {
    constructor() {
      (this.rootNode = { children: [] }), (this.stack = [this.rootNode]);
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    add(e) {
      this.top.children.push(e);
    }
    openNode(e) {
      const n = { kind: e, children: [] };
      this.add(n), this.stack.push(n);
    }
    closeNode() {
      if (this.stack.length > 1) return this.stack.pop();
    }
    closeAllNodes() {
      for (; this.closeNode(); );
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4);
    }
    walk(e) {
      return this.constructor._walk(e, this.rootNode);
    }
    static _walk(e, n) {
      return (
        "string" == typeof n
          ? e.addText(n)
          : n.children &&
            (e.openNode(n),
            n.children.forEach((n) => this._walk(e, n)),
            e.closeNode(n)),
        e
      );
    }
    static _collapse(e) {
      "string" != typeof e &&
        e.children &&
        (e.children.every((e) => "string" == typeof e)
          ? (e.children = [e.children.join("")])
          : e.children.forEach((e) => {
              c._collapse(e);
            }));
    }
  }
  class u extends c {
    constructor(e) {
      super(), (this.options = e);
    }
    addKeyword(e, n) {
      "" !== e && (this.openNode(n), this.addText(e), this.closeNode());
    }
    addText(e) {
      "" !== e && this.add(e);
    }
    addSublanguage(e, n) {
      const t = e.root;
      (t.kind = n), (t.sublanguage = !0), this.add(t);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return !0;
    }
  }
  function d(e) {
    return e ? ("string" == typeof e ? e : e.source) : null;
  }
  const g =
      "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
    h = { begin: "\\\\[\\s\\S]", relevance: 0 },
    f = {
      className: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [h],
    },
    p = {
      className: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [h],
    },
    b = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
    },
    m = function (e, n, t = {}) {
      var a = r({ className: "comment", begin: e, end: n, contains: [] }, t);
      return (
        a.contains.push(b),
        a.contains.push({
          className: "doctag",
          begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
          relevance: 0,
        }),
        a
      );
    },
    v = m("//", "$"),
    x = m("/\\*", "\\*/"),
    E = m("#", "$");
  var _ = Object.freeze({
      __proto__: null,
      IDENT_RE: "[a-zA-Z]\\w*",
      UNDERSCORE_IDENT_RE: "[a-zA-Z_]\\w*",
      NUMBER_RE: "\\b\\d+(\\.\\d+)?",
      C_NUMBER_RE: g,
      BINARY_NUMBER_RE: "\\b(0b[01]+)",
      RE_STARTERS_RE:
        "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
      SHEBANG: (e = {}) => {
        const n = /^#![ ]*\//;
        return (
          e.binary &&
            (e.begin = (function (...e) {
              return e.map((e) => d(e)).join("");
            })(n, /.*\b/, e.binary, /\b.*/)),
          r(
            {
              className: "meta",
              begin: n,
              end: /$/,
              relevance: 0,
              "on:begin": (e, n) => {
                0 !== e.index && n.ignoreMatch();
              },
            },
            e
          )
        );
      },
      BACKSLASH_ESCAPE: h,
      APOS_STRING_MODE: f,
      QUOTE_STRING_MODE: p,
      PHRASAL_WORDS_MODE: b,
      COMMENT: m,
      C_LINE_COMMENT_MODE: v,
      C_BLOCK_COMMENT_MODE: x,
      HASH_COMMENT_MODE: E,
      NUMBER_MODE: {
        className: "number",
        begin: "\\b\\d+(\\.\\d+)?",
        relevance: 0,
      },
      C_NUMBER_MODE: { className: "number", begin: g, relevance: 0 },
      BINARY_NUMBER_MODE: {
        className: "number",
        begin: "\\b(0b[01]+)",
        relevance: 0,
      },
      CSS_NUMBER_MODE: {
        className: "number",
        begin:
          "\\b\\d+(\\.\\d+)?(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        relevance: 0,
      },
      REGEXP_MODE: {
        begin: /(?=\/[^/\n]*\/)/,
        contains: [
          {
            className: "regexp",
            begin: /\//,
            end: /\/[gimuy]*/,
            illegal: /\n/,
            contains: [
              h,
              { begin: /\[/, end: /\]/, relevance: 0, contains: [h] },
            ],
          },
        ],
      },
      TITLE_MODE: { className: "title", begin: "[a-zA-Z]\\w*", relevance: 0 },
      UNDERSCORE_TITLE_MODE: {
        className: "title",
        begin: "[a-zA-Z_]\\w*",
        relevance: 0,
      },
      METHOD_GUARD: { begin: "\\.\\s*[a-zA-Z_]\\w*", relevance: 0 },
      END_SAME_AS_BEGIN: function (e) {
        return Object.assign(e, {
          "on:begin": (e, n) => {
            n.data._beginMatch = e[1];
          },
          "on:end": (e, n) => {
            n.data._beginMatch !== e[1] && n.ignoreMatch();
          },
        });
      },
    }),
    N = "of and for in not or if then".split(" ");
  function w(e, n) {
    return n
      ? +n
      : (function (e) {
          return N.includes(e.toLowerCase());
        })(e)
      ? 0
      : 1;
  }
  const R = t,
    y = r,
    { nodeStream: k, mergeStreams: O } = i,
    M = Symbol("nomatch");
  return (function (t) {
    var a = [],
      i = {},
      s = {},
      o = [],
      l = !0,
      c = /(^(<[^>]+>|\t|)+|\n)/gm,
      g =
        "Could not find the language '{}', did you forget to load/include a language module?";
    const h = { disableAutodetect: !0, name: "Plain text", contains: [] };
    var f = {
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      tabReplace: null,
      useBR: !1,
      languages: null,
      __emitter: u,
    };
    function p(e) {
      return f.noHighlightRe.test(e);
    }
    function b(e, n, t, r) {
      var a = { code: n, language: e };
      S("before:highlight", a);
      var i = a.result ? a.result : m(a.language, a.code, t, r);
      return (i.code = a.code), S("after:highlight", i), i;
    }
    function m(e, t, a, s) {
      var o = t;
      function c(e, n) {
        var t = E.case_insensitive ? n[0].toLowerCase() : n[0];
        return (
          Object.prototype.hasOwnProperty.call(e.keywords, t) && e.keywords[t]
        );
      }
      function u() {
        null != y.subLanguage
          ? (function () {
              if ("" !== A) {
                var e = null;
                if ("string" == typeof y.subLanguage) {
                  if (!i[y.subLanguage]) return void O.addText(A);
                  (e = m(y.subLanguage, A, !0, k[y.subLanguage])),
                    (k[y.subLanguage] = e.top);
                } else e = v(A, y.subLanguage.length ? y.subLanguage : null);
                y.relevance > 0 && (I += e.relevance),
                  O.addSublanguage(e.emitter, e.language);
              }
            })()
          : (function () {
              if (!y.keywords) return void O.addText(A);
              let e = 0;
              y.keywordPatternRe.lastIndex = 0;
              let n = y.keywordPatternRe.exec(A),
                t = "";
              for (; n; ) {
                t += A.substring(e, n.index);
                const r = c(y, n);
                if (r) {
                  const [e, a] = r;
                  O.addText(t), (t = ""), (I += a), O.addKeyword(n[0], e);
                } else t += n[0];
                (e = y.keywordPatternRe.lastIndex),
                  (n = y.keywordPatternRe.exec(A));
              }
              (t += A.substr(e)), O.addText(t);
            })(),
          (A = "");
      }
      function h(e) {
        return (
          e.className && O.openNode(e.className),
          (y = Object.create(e, { parent: { value: y } }))
        );
      }
      function p(e) {
        return 0 === y.matcher.regexIndex ? ((A += e[0]), 1) : ((L = !0), 0);
      }
      var b = {};
      function x(t, r) {
        var i = r && r[0];
        if (((A += t), null == i)) return u(), 0;
        if (
          "begin" === b.type &&
          "end" === r.type &&
          b.index === r.index &&
          "" === i
        ) {
          if (((A += o.slice(r.index, r.index + 1)), !l)) {
            const n = Error("0 width match regex");
            throw ((n.languageName = e), (n.badRule = b.rule), n);
          }
          return 1;
        }
        if (((b = r), "begin" === r.type))
          return (function (e) {
            var t = e[0],
              r = e.rule;
            const a = new n(r),
              i = [r.__beforeBegin, r["on:begin"]];
            for (const n of i) if (n && (n(e, a), a.ignore)) return p(t);
            return (
              r &&
                r.endSameAsBegin &&
                (r.endRe = RegExp(
                  t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
                  "m"
                )),
              r.skip
                ? (A += t)
                : (r.excludeBegin && (A += t),
                  u(),
                  r.returnBegin || r.excludeBegin || (A = t)),
              h(r),
              r.returnBegin ? 0 : t.length
            );
          })(r);
        if ("illegal" === r.type && !a) {
          const e = Error(
            'Illegal lexeme "' +
              i +
              '" for mode "' +
              (y.className || "<unnamed>") +
              '"'
          );
          throw ((e.mode = y), e);
        }
        if ("end" === r.type) {
          var s = (function (e) {
            var t = e[0],
              r = o.substr(e.index),
              a = (function e(t, r, a) {
                let i = (function (e, n) {
                  var t = e && e.exec(n);
                  return t && 0 === t.index;
                })(t.endRe, a);
                if (i) {
                  if (t["on:end"]) {
                    const e = new n(t);
                    t["on:end"](r, e), e.ignore && (i = !1);
                  }
                  if (i) {
                    for (; t.endsParent && t.parent; ) t = t.parent;
                    return t;
                  }
                }
                if (t.endsWithParent) return e(t.parent, r, a);
              })(y, e, r);
            if (!a) return M;
            var i = y;
            i.skip
              ? (A += t)
              : (i.returnEnd || i.excludeEnd || (A += t),
                u(),
                i.excludeEnd && (A = t));
            do {
              y.className && O.closeNode(),
                y.skip || y.subLanguage || (I += y.relevance),
                (y = y.parent);
            } while (y !== a.parent);
            return (
              a.starts &&
                (a.endSameAsBegin && (a.starts.endRe = a.endRe), h(a.starts)),
              i.returnEnd ? 0 : t.length
            );
          })(r);
          if (s !== M) return s;
        }
        if ("illegal" === r.type && "" === i) return 1;
        if (B > 1e5 && B > 3 * r.index)
          throw Error(
            "potential infinite loop, way more iterations than matches"
          );
        return (A += i), i.length;
      }
      var E = T(e);
      if (!E)
        throw (
          (console.error(g.replace("{}", e)),
          Error('Unknown language: "' + e + '"'))
        );
      var _ = (function (e) {
          function n(n, t) {
            return RegExp(
              d(n),
              "m" + (e.case_insensitive ? "i" : "") + (t ? "g" : "")
            );
          }
          class t {
            constructor() {
              (this.matchIndexes = {}),
                (this.regexes = []),
                (this.matchAt = 1),
                (this.position = 0);
            }
            addRule(e, n) {
              (n.position = this.position++),
                (this.matchIndexes[this.matchAt] = n),
                this.regexes.push([n, e]),
                (this.matchAt +=
                  (function (e) {
                    return RegExp(e.toString() + "|").exec("").length - 1;
                  })(e) + 1);
            }
            compile() {
              0 === this.regexes.length && (this.exec = () => null);
              const e = this.regexes.map((e) => e[1]);
              (this.matcherRe = n(
                (function (e, n = "|") {
                  for (
                    var t = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./,
                      r = 0,
                      a = "",
                      i = 0;
                    i < e.length;
                    i++
                  ) {
                    var s = (r += 1),
                      o = d(e[i]);
                    for (i > 0 && (a += n), a += "("; o.length > 0; ) {
                      var l = t.exec(o);
                      if (null == l) {
                        a += o;
                        break;
                      }
                      (a += o.substring(0, l.index)),
                        (o = o.substring(l.index + l[0].length)),
                        "\\" === l[0][0] && l[1]
                          ? (a += "\\" + (+l[1] + s))
                          : ((a += l[0]), "(" === l[0] && r++);
                    }
                    a += ")";
                  }
                  return a;
                })(e),
                !0
              )),
                (this.lastIndex = 0);
            }
            exec(e) {
              this.matcherRe.lastIndex = this.lastIndex;
              const n = this.matcherRe.exec(e);
              if (!n) return null;
              const t = n.findIndex((e, n) => n > 0 && void 0 !== e),
                r = this.matchIndexes[t];
              return n.splice(0, t), Object.assign(n, r);
            }
          }
          class a {
            constructor() {
              (this.rules = []),
                (this.multiRegexes = []),
                (this.count = 0),
                (this.lastIndex = 0),
                (this.regexIndex = 0);
            }
            getMatcher(e) {
              if (this.multiRegexes[e]) return this.multiRegexes[e];
              const n = new t();
              return (
                this.rules.slice(e).forEach(([e, t]) => n.addRule(e, t)),
                n.compile(),
                (this.multiRegexes[e] = n),
                n
              );
            }
            considerAll() {
              this.regexIndex = 0;
            }
            addRule(e, n) {
              this.rules.push([e, n]), "begin" === n.type && this.count++;
            }
            exec(e) {
              const n = this.getMatcher(this.regexIndex);
              n.lastIndex = this.lastIndex;
              const t = n.exec(e);
              return (
                t &&
                  ((this.regexIndex += t.position + 1),
                  this.regexIndex === this.count && (this.regexIndex = 0)),
                t
              );
            }
          }
          function i(e, n) {
            const t = e.input[e.index - 1],
              r = e.input[e.index + e[0].length];
            ("." !== t && "." !== r) || n.ignoreMatch();
          }
          if (e.contains && e.contains.includes("self"))
            throw Error(
              "ERR: contains `self` is not supported at the top-level of a language.  See documentation."
            );
          return (function t(s, o) {
            const l = s;
            if (s.compiled) return l;
            (s.compiled = !0),
              (s.__beforeBegin = null),
              (s.keywords = s.keywords || s.beginKeywords);
            let c = null;
            if (
              ("object" == typeof s.keywords &&
                ((c = s.keywords.$pattern), delete s.keywords.$pattern),
              s.keywords &&
                (s.keywords = (function (e, n) {
                  var t = {};
                  return (
                    "string" == typeof e
                      ? r("keyword", e)
                      : Object.keys(e).forEach(function (n) {
                          r(n, e[n]);
                        }),
                    t
                  );
                  function r(e, r) {
                    n && (r = r.toLowerCase()),
                      r.split(" ").forEach(function (n) {
                        var r = n.split("|");
                        t[r[0]] = [e, w(r[0], r[1])];
                      });
                  }
                })(s.keywords, e.case_insensitive)),
              s.lexemes && c)
            )
              throw Error(
                "ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) "
              );
            return (
              (l.keywordPatternRe = n(s.lexemes || c || /\w+/, !0)),
              o &&
                (s.beginKeywords &&
                  ((s.begin =
                    "\\b(" +
                    s.beginKeywords.split(" ").join("|") +
                    ")(?=\\b|\\s)"),
                  (s.__beforeBegin = i)),
                s.begin || (s.begin = /\B|\b/),
                (l.beginRe = n(s.begin)),
                s.endSameAsBegin && (s.end = s.begin),
                s.end || s.endsWithParent || (s.end = /\B|\b/),
                s.end && (l.endRe = n(s.end)),
                (l.terminator_end = d(s.end) || ""),
                s.endsWithParent &&
                  o.terminator_end &&
                  (l.terminator_end += (s.end ? "|" : "") + o.terminator_end)),
              s.illegal && (l.illegalRe = n(s.illegal)),
              void 0 === s.relevance && (s.relevance = 1),
              s.contains || (s.contains = []),
              (s.contains = [].concat(
                ...s.contains.map(function (e) {
                  return (function (e) {
                    return (
                      e.variants &&
                        !e.cached_variants &&
                        (e.cached_variants = e.variants.map(function (n) {
                          return r(e, { variants: null }, n);
                        })),
                      e.cached_variants
                        ? e.cached_variants
                        : (function e(n) {
                            return !!n && (n.endsWithParent || e(n.starts));
                          })(e)
                        ? r(e, { starts: e.starts ? r(e.starts) : null })
                        : Object.isFrozen(e)
                        ? r(e)
                        : e
                    );
                  })("self" === e ? s : e);
                })
              )),
              s.contains.forEach(function (e) {
                t(e, l);
              }),
              s.starts && t(s.starts, o),
              (l.matcher = (function (e) {
                const n = new a();
                return (
                  e.contains.forEach((e) =>
                    n.addRule(e.begin, { rule: e, type: "begin" })
                  ),
                  e.terminator_end &&
                    n.addRule(e.terminator_end, { type: "end" }),
                  e.illegal && n.addRule(e.illegal, { type: "illegal" }),
                  n
                );
              })(l)),
              l
            );
          })(e);
        })(E),
        N = "",
        y = s || _,
        k = {},
        O = new f.__emitter(f);
      !(function () {
        for (var e = [], n = y; n !== E; n = n.parent)
          n.className && e.unshift(n.className);
        e.forEach((e) => O.openNode(e));
      })();
      var A = "",
        I = 0,
        S = 0,
        B = 0,
        L = !1;
      try {
        for (y.matcher.considerAll(); ; ) {
          B++,
            L ? (L = !1) : ((y.matcher.lastIndex = S), y.matcher.considerAll());
          const e = y.matcher.exec(o);
          if (!e) break;
          const n = x(o.substring(S, e.index), e);
          S = e.index + n;
        }
        return (
          x(o.substr(S)),
          O.closeAllNodes(),
          O.finalize(),
          (N = O.toHTML()),
          {
            relevance: I,
            value: N,
            language: e,
            illegal: !1,
            emitter: O,
            top: y,
          }
        );
      } catch (n) {
        if (n.message && n.message.includes("Illegal"))
          return {
            illegal: !0,
            illegalBy: {
              msg: n.message,
              context: o.slice(S - 100, S + 100),
              mode: n.mode,
            },
            sofar: N,
            relevance: 0,
            value: R(o),
            emitter: O,
          };
        if (l)
          return {
            illegal: !1,
            relevance: 0,
            value: R(o),
            emitter: O,
            language: e,
            top: y,
            errorRaised: n,
          };
        throw n;
      }
    }
    function v(e, n) {
      n = n || f.languages || Object.keys(i);
      var t = (function (e) {
          const n = {
            relevance: 0,
            emitter: new f.__emitter(f),
            value: R(e),
            illegal: !1,
            top: h,
          };
          return n.emitter.addText(e), n;
        })(e),
        r = t;
      return (
        n
          .filter(T)
          .filter(I)
          .forEach(function (n) {
            var a = m(n, e, !1);
            (a.language = n),
              a.relevance > r.relevance && (r = a),
              a.relevance > t.relevance && ((r = t), (t = a));
          }),
        r.language && (t.second_best = r),
        t
      );
    }
    function x(e) {
      return f.tabReplace || f.useBR
        ? e.replace(c, (e) =>
            "\n" === e
              ? f.useBR
                ? "<br>"
                : e
              : f.tabReplace
              ? e.replace(/\t/g, f.tabReplace)
              : e
          )
        : e;
    }
    function E(e) {
      let n = null;
      const t = (function (e) {
        var n = e.className + " ";
        n += e.parentNode ? e.parentNode.className : "";
        const t = f.languageDetectRe.exec(n);
        if (t) {
          var r = T(t[1]);
          return (
            r ||
              (console.warn(g.replace("{}", t[1])),
              console.warn(
                "Falling back to no-highlight mode for this block.",
                e
              )),
            r ? t[1] : "no-highlight"
          );
        }
        return n.split(/\s+/).find((e) => p(e) || T(e));
      })(e);
      if (p(t)) return;
      S("before:highlightBlock", { block: e, language: t }),
        f.useBR
          ? ((n = document.createElement(
              "div"
            )).innerHTML = e.innerHTML
              .replace(/\n/g, "")
              .replace(/<br[ /]*>/g, "\n"))
          : (n = e);
      const r = n.textContent,
        a = t ? b(t, r, !0) : v(r),
        i = k(n);
      if (i.length) {
        const e = document.createElement("div");
        (e.innerHTML = a.value), (a.value = O(i, k(e), r));
      }
      (a.value = x(a.value)),
        S("after:highlightBlock", { block: e, result: a }),
        (e.innerHTML = a.value),
        (e.className = (function (e, n, t) {
          var r = n ? s[n] : t,
            a = [e.trim()];
          return (
            e.match(/\bhljs\b/) || a.push("hljs"),
            e.includes(r) || a.push(r),
            a.join(" ").trim()
          );
        })(e.className, t, a.language)),
        (e.result = {
          language: a.language,
          re: a.relevance,
          relavance: a.relevance,
        }),
        a.second_best &&
          (e.second_best = {
            language: a.second_best.language,
            re: a.second_best.relevance,
            relavance: a.second_best.relevance,
          });
    }
    const N = () => {
      if (!N.called) {
        N.called = !0;
        var e = document.querySelectorAll("pre code");
        a.forEach.call(e, E);
      }
    };
    function T(e) {
      return (e = (e || "").toLowerCase()), i[e] || i[s[e]];
    }
    function A(e, { languageName: n }) {
      "string" == typeof e && (e = [e]),
        e.forEach((e) => {
          s[e] = n;
        });
    }
    function I(e) {
      var n = T(e);
      return n && !n.disableAutodetect;
    }
    function S(e, n) {
      var t = e;
      o.forEach(function (e) {
        e[t] && e[t](n);
      });
    }
    Object.assign(t, {
      highlight: b,
      highlightAuto: v,
      fixMarkup: x,
      highlightBlock: E,
      configure: function (e) {
        f = y(f, e);
      },
      initHighlighting: N,
      initHighlightingOnLoad: function () {
        window.addEventListener("DOMContentLoaded", N, !1);
      },
      registerLanguage: function (e, n) {
        var r = null;
        try {
          r = n(t);
        } catch (n) {
          if (
            (console.error(
              "Language definition for '{}' could not be registered.".replace(
                "{}",
                e
              )
            ),
            !l)
          )
            throw n;
          console.error(n), (r = h);
        }
        r.name || (r.name = e),
          (i[e] = r),
          (r.rawDefinition = n.bind(null, t)),
          r.aliases && A(r.aliases, { languageName: e });
      },
      listLanguages: function () {
        return Object.keys(i);
      },
      getLanguage: T,
      registerAliases: A,
      requireLanguage: function (e) {
        var n = T(e);
        if (n) return n;
        throw Error(
          "The '{}' language is required, but not loaded.".replace("{}", e)
        );
      },
      autoDetection: I,
      inherit: y,
      addPlugin: function (e) {
        o.push(e);
      },
    }),
      (t.debugMode = function () {
        l = !1;
      }),
      (t.safeMode = function () {
        l = !0;
      }),
      (t.versionString = "10.1.1");
    for (const n in _) "object" == typeof _[n] && e(_[n]);
    return Object.assign(t, _), t;
  })({});
})();
"object" == typeof exports &&
  "undefined" != typeof module &&
  (module.exports = hljs);
hljs.registerLanguage(
  "c-like",
  (function () {
    "use strict";
    return function (e) {
      function t(e) {
        return "(?:" + e + ")?";
      }
      var n =
          "(decltype\\(auto\\)|" +
          t("[a-zA-Z_]\\w*::") +
          "[a-zA-Z_]\\w*" +
          t("<.*?>") +
          ")",
        r = { className: "keyword", begin: "\\b[a-z\\d_]*_t\\b" },
        a = {
          className: "string",
          variants: [
            {
              begin: '(u8?|U|L)?"',
              end: '"',
              illegal: "\\n",
              contains: [e.BACKSLASH_ESCAPE],
            },
            {
              begin:
                "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
              end: "'",
              illegal: ".",
            },
            e.END_SAME_AS_BEGIN({
              begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
              end: /\)([^()\\ ]{0,16})"/,
            }),
          ],
        },
        i = {
          className: "number",
          variants: [
            { begin: "\\b(0b[01']+)" },
            {
              begin:
                "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)",
            },
            {
              begin:
                "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
            },
          ],
          relevance: 0,
        },
        s = {
          className: "meta",
          begin: /#\s*[a-z]+\b/,
          end: /$/,
          keywords: {
            "meta-keyword":
              "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include",
          },
          contains: [
            { begin: /\\\n/, relevance: 0 },
            e.inherit(a, { className: "meta-string" }),
            {
              className: "meta-string",
              begin: /<.*?>/,
              end: /$/,
              illegal: "\\n",
            },
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
          ],
        },
        o = {
          className: "title",
          begin: t("[a-zA-Z_]\\w*::") + e.IDENT_RE,
          relevance: 0,
        },
        c = t("[a-zA-Z_]\\w*::") + e.IDENT_RE + "\\s*\\(",
        l = {
          keyword:
            "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
          built_in:
            "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
          literal: "true false nullptr NULL",
        },
        d = [r, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, i, a],
        _ = {
          variants: [
            { begin: /=/, end: /;/ },
            { begin: /\(/, end: /\)/ },
            { beginKeywords: "new throw return else", end: /;/ },
          ],
          keywords: l,
          contains: d.concat([
            {
              begin: /\(/,
              end: /\)/,
              keywords: l,
              contains: d.concat(["self"]),
              relevance: 0,
            },
          ]),
          relevance: 0,
        },
        u = {
          className: "function",
          begin: "(" + n + "[\\*&\\s]+)+" + c,
          returnBegin: !0,
          end: /[{;=]/,
          excludeEnd: !0,
          keywords: l,
          illegal: /[^\w\s\*&:<>]/,
          contains: [
            { begin: "decltype\\(auto\\)", keywords: l, relevance: 0 },
            { begin: c, returnBegin: !0, contains: [o], relevance: 0 },
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              keywords: l,
              relevance: 0,
              contains: [
                e.C_LINE_COMMENT_MODE,
                e.C_BLOCK_COMMENT_MODE,
                a,
                i,
                r,
                {
                  begin: /\(/,
                  end: /\)/,
                  keywords: l,
                  relevance: 0,
                  contains: [
                    "self",
                    e.C_LINE_COMMENT_MODE,
                    e.C_BLOCK_COMMENT_MODE,
                    a,
                    i,
                    r,
                  ],
                },
              ],
            },
            r,
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            s,
          ],
        };
      return {
        aliases: ["c", "cc", "h", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
        keywords: l,
        disableAutodetect: !0,
        illegal: "</",
        contains: [].concat(_, u, d, [
          s,
          {
            begin:
              "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
            end: ">",
            keywords: l,
            contains: ["self", r],
          },
          { begin: e.IDENT_RE + "::", keywords: l },
          {
            className: "class",
            beginKeywords: "class struct",
            end: /[{;:]/,
            contains: [
              { begin: /</, end: />/, contains: ["self"] },
              e.TITLE_MODE,
            ],
          },
        ]),
        exports: { preprocessor: s, strings: a, keywords: l },
      };
    };
  })()
);
hljs.registerLanguage(
  "apache",
  (function () {
    "use strict";
    return function (e) {
      var n = {
        className: "number",
        begin: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?",
      };
      return {
        name: "Apache config",
        aliases: ["apacheconf"],
        case_insensitive: !0,
        contains: [
          e.HASH_COMMENT_MODE,
          {
            className: "section",
            begin: "</?",
            end: ">",
            contains: [
              n,
              { className: "number", begin: ":\\d{1,5}" },
              e.inherit(e.QUOTE_STRING_MODE, { relevance: 0 }),
            ],
          },
          {
            className: "attribute",
            begin: /\w+/,
            relevance: 0,
            keywords: {
              nomarkup:
                "order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername",
            },
            starts: {
              end: /$/,
              relevance: 0,
              keywords: { literal: "on off all deny allow" },
              contains: [
                { className: "meta", begin: "\\s\\[", end: "\\]$" },
                {
                  className: "variable",
                  begin: "[\\$%]\\{",
                  end: "\\}",
                  contains: [
                    "self",
                    { className: "number", begin: "[\\$%]\\d+" },
                  ],
                },
                n,
                { className: "number", begin: "\\d+" },
                e.QUOTE_STRING_MODE,
              ],
            },
          },
        ],
        illegal: /\S/,
      };
    };
  })()
);
hljs.registerLanguage(
  "kotlin",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          keyword:
            "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual trait volatile transient native default",
          built_in:
            "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
          literal: "true false null",
        },
        a = { className: "symbol", begin: e.UNDERSCORE_IDENT_RE + "@" },
        i = {
          className: "subst",
          begin: "\\${",
          end: "}",
          contains: [e.C_NUMBER_MODE],
        },
        s = { className: "variable", begin: "\\$" + e.UNDERSCORE_IDENT_RE },
        t = {
          className: "string",
          variants: [
            { begin: '"""', end: '"""(?=[^"])', contains: [s, i] },
            {
              begin: "'",
              end: "'",
              illegal: /\n/,
              contains: [e.BACKSLASH_ESCAPE],
            },
            {
              begin: '"',
              end: '"',
              illegal: /\n/,
              contains: [e.BACKSLASH_ESCAPE, s, i],
            },
          ],
        };
      i.contains.push(t);
      var r = {
          className: "meta",
          begin:
            "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" +
            e.UNDERSCORE_IDENT_RE +
            ")?",
        },
        l = {
          className: "meta",
          begin: "@" + e.UNDERSCORE_IDENT_RE,
          contains: [
            {
              begin: /\(/,
              end: /\)/,
              contains: [e.inherit(t, { className: "meta-string" })],
            },
          ],
        },
        c = e.COMMENT("/\\*", "\\*/", { contains: [e.C_BLOCK_COMMENT_MODE] }),
        o = {
          variants: [
            { className: "type", begin: e.UNDERSCORE_IDENT_RE },
            { begin: /\(/, end: /\)/, contains: [] },
          ],
        },
        d = o;
      return (
        (d.variants[1].contains = [o]),
        (o.variants[1].contains = [d]),
        {
          name: "Kotlin",
          aliases: ["kt"],
          keywords: n,
          contains: [
            e.COMMENT("/\\*\\*", "\\*/", {
              relevance: 0,
              contains: [{ className: "doctag", begin: "@[A-Za-z]+" }],
            }),
            e.C_LINE_COMMENT_MODE,
            c,
            {
              className: "keyword",
              begin: /\b(break|continue|return|this)\b/,
              starts: { contains: [{ className: "symbol", begin: /@\w+/ }] },
            },
            a,
            r,
            l,
            {
              className: "function",
              beginKeywords: "fun",
              end: "[(]|$",
              returnBegin: !0,
              excludeEnd: !0,
              keywords: n,
              illegal: /fun\s+(<.*>)?[^\s\(]+(\s+[^\s\(]+)\s*=/,
              relevance: 5,
              contains: [
                {
                  begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
                  returnBegin: !0,
                  relevance: 0,
                  contains: [e.UNDERSCORE_TITLE_MODE],
                },
                {
                  className: "type",
                  begin: /</,
                  end: />/,
                  keywords: "reified",
                  relevance: 0,
                },
                {
                  className: "params",
                  begin: /\(/,
                  end: /\)/,
                  endsParent: !0,
                  keywords: n,
                  relevance: 0,
                  contains: [
                    {
                      begin: /:/,
                      end: /[=,\/]/,
                      endsWithParent: !0,
                      contains: [o, e.C_LINE_COMMENT_MODE, c],
                      relevance: 0,
                    },
                    e.C_LINE_COMMENT_MODE,
                    c,
                    r,
                    l,
                    t,
                    e.C_NUMBER_MODE,
                  ],
                },
                c,
              ],
            },
            {
              className: "class",
              beginKeywords: "class interface trait",
              end: /[:\{(]|$/,
              excludeEnd: !0,
              illegal: "extends implements",
              contains: [
                {
                  beginKeywords:
                    "public protected internal private constructor",
                },
                e.UNDERSCORE_TITLE_MODE,
                {
                  className: "type",
                  begin: /</,
                  end: />/,
                  excludeBegin: !0,
                  excludeEnd: !0,
                  relevance: 0,
                },
                {
                  className: "type",
                  begin: /[,:]\s*/,
                  end: /[<\(,]|$/,
                  excludeBegin: !0,
                  returnEnd: !0,
                },
                r,
                l,
              ],
            },
            t,
            {
              className: "meta",
              begin: "^#!/usr/bin/env",
              end: "$",
              illegal: "\n",
            },
            {
              className: "number",
              begin:
                "\\b(0[bB]([01]+[01_]+[01]+|[01]+)|0[xX]([a-fA-F0-9]+[a-fA-F0-9_]+[a-fA-F0-9]+|[a-fA-F0-9]+)|(([\\d]+[\\d_]+[\\d]+|[\\d]+)(\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))?|\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))([eE][-+]?\\d+)?)[lLfF]?",
              relevance: 0,
            },
          ],
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "php",
  (function () {
    "use strict";
    return function (e) {
      var r = { begin: "\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*" },
        t = {
          className: "meta",
          variants: [
            { begin: /<\?php/, relevance: 10 },
            { begin: /<\?[=]?/ },
            { begin: /\?>/ },
          ],
        },
        a = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE, t],
          variants: [
            { begin: 'b"', end: '"' },
            { begin: "b'", end: "'" },
            e.inherit(e.APOS_STRING_MODE, { illegal: null }),
            e.inherit(e.QUOTE_STRING_MODE, { illegal: null }),
          ],
        },
        n = { variants: [e.BINARY_NUMBER_MODE, e.C_NUMBER_MODE] },
        i = {
          keyword:
            "__CLASS__ __DIR__ __FILE__ __FUNCTION__ __LINE__ __METHOD__ __NAMESPACE__ __TRAIT__ die echo exit include include_once print require require_once array abstract and as binary bool boolean break callable case catch class clone const continue declare default do double else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval extends final finally float for foreach from global goto if implements instanceof insteadof int integer interface isset iterable list new object or private protected public real return string switch throw trait try unset use var void while xor yield",
          literal: "false null true",
          built_in:
            "Error|0 AppendIterator ArgumentCountError ArithmeticError ArrayIterator ArrayObject AssertionError BadFunctionCallException BadMethodCallException CachingIterator CallbackFilterIterator CompileError Countable DirectoryIterator DivisionByZeroError DomainException EmptyIterator ErrorException Exception FilesystemIterator FilterIterator GlobIterator InfiniteIterator InvalidArgumentException IteratorIterator LengthException LimitIterator LogicException MultipleIterator NoRewindIterator OutOfBoundsException OutOfRangeException OuterIterator OverflowException ParentIterator ParseError RangeException RecursiveArrayIterator RecursiveCachingIterator RecursiveCallbackFilterIterator RecursiveDirectoryIterator RecursiveFilterIterator RecursiveIterator RecursiveIteratorIterator RecursiveRegexIterator RecursiveTreeIterator RegexIterator RuntimeException SeekableIterator SplDoublyLinkedList SplFileInfo SplFileObject SplFixedArray SplHeap SplMaxHeap SplMinHeap SplObjectStorage SplObserver SplObserver SplPriorityQueue SplQueue SplStack SplSubject SplSubject SplTempFileObject TypeError UnderflowException UnexpectedValueException ArrayAccess Closure Generator Iterator IteratorAggregate Serializable Throwable Traversable WeakReference Directory __PHP_Incomplete_Class parent php_user_filter self static stdClass",
        };
      return {
        aliases: ["php", "php3", "php4", "php5", "php6", "php7"],
        case_insensitive: !0,
        keywords: i,
        contains: [
          e.HASH_COMMENT_MODE,
          e.COMMENT("//", "$", { contains: [t] }),
          e.COMMENT("/\\*", "\\*/", {
            contains: [{ className: "doctag", begin: "@[A-Za-z]+" }],
          }),
          e.COMMENT("__halt_compiler.+?;", !1, {
            endsWithParent: !0,
            keywords: "__halt_compiler",
          }),
          {
            className: "string",
            begin: /<<<['"]?\w+['"]?$/,
            end: /^\w+;?$/,
            contains: [
              e.BACKSLASH_ESCAPE,
              {
                className: "subst",
                variants: [{ begin: /\$\w+/ }, { begin: /\{\$/, end: /\}/ }],
              },
            ],
          },
          t,
          { className: "keyword", begin: /\$this\b/ },
          r,
          { begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/ },
          {
            className: "function",
            beginKeywords: "fn function",
            end: /[;{]/,
            excludeEnd: !0,
            illegal: "[$%\\[]",
            contains: [
              e.UNDERSCORE_TITLE_MODE,
              {
                className: "params",
                begin: "\\(",
                end: "\\)",
                excludeBegin: !0,
                excludeEnd: !0,
                keywords: i,
                contains: ["self", r, e.C_BLOCK_COMMENT_MODE, a, n],
              },
            ],
          },
          {
            className: "class",
            beginKeywords: "class interface",
            end: "{",
            excludeEnd: !0,
            illegal: /[:\(\$"]/,
            contains: [
              { beginKeywords: "extends implements" },
              e.UNDERSCORE_TITLE_MODE,
            ],
          },
          {
            beginKeywords: "namespace",
            end: ";",
            illegal: /[\.']/,
            contains: [e.UNDERSCORE_TITLE_MODE],
          },
          {
            beginKeywords: "use",
            end: ";",
            contains: [e.UNDERSCORE_TITLE_MODE],
          },
          { begin: "=>" },
          a,
          n,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "css",
  (function () {
    "use strict";
    return function (e) {
      var n = {
        begin: /(?:[A-Z\_\.\-]+|--[a-zA-Z0-9_-]+)\s*:/,
        returnBegin: !0,
        end: ";",
        endsWithParent: !0,
        contains: [
          {
            className: "attribute",
            begin: /\S/,
            end: ":",
            excludeEnd: !0,
            starts: {
              endsWithParent: !0,
              excludeEnd: !0,
              contains: [
                {
                  begin: /[\w-]+\(/,
                  returnBegin: !0,
                  contains: [
                    { className: "built_in", begin: /[\w-]+/ },
                    {
                      begin: /\(/,
                      end: /\)/,
                      contains: [
                        e.APOS_STRING_MODE,
                        e.QUOTE_STRING_MODE,
                        e.CSS_NUMBER_MODE,
                      ],
                    },
                  ],
                },
                e.CSS_NUMBER_MODE,
                e.QUOTE_STRING_MODE,
                e.APOS_STRING_MODE,
                e.C_BLOCK_COMMENT_MODE,
                { className: "number", begin: "#[0-9A-Fa-f]+" },
                { className: "meta", begin: "!important" },
              ],
            },
          },
        ],
      };
      return {
        name: "CSS",
        case_insensitive: !0,
        illegal: /[=\/|'\$]/,
        contains: [
          e.C_BLOCK_COMMENT_MODE,
          { className: "selector-id", begin: /#[A-Za-z0-9_-]+/ },
          { className: "selector-class", begin: /\.[A-Za-z0-9_-]+/ },
          {
            className: "selector-attr",
            begin: /\[/,
            end: /\]/,
            illegal: "$",
            contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
          },
          {
            className: "selector-pseudo",
            begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/,
          },
          {
            begin: "@(page|font-face)",
            lexemes: "@[a-z-]+",
            keywords: "@page @font-face",
          },
          {
            begin: "@",
            end: "[{;]",
            illegal: /:/,
            returnBegin: !0,
            contains: [
              { className: "keyword", begin: /@\-?\w[\w]*(\-\w+)*/ },
              {
                begin: /\s/,
                endsWithParent: !0,
                excludeEnd: !0,
                relevance: 0,
                keywords: "and or not only",
                contains: [
                  { begin: /[a-z-]+:/, className: "attribute" },
                  e.APOS_STRING_MODE,
                  e.QUOTE_STRING_MODE,
                  e.CSS_NUMBER_MODE,
                ],
              },
            ],
          },
          {
            className: "selector-tag",
            begin: "[a-zA-Z-][a-zA-Z0-9_-]*",
            relevance: 0,
          },
          {
            begin: "{",
            end: "}",
            illegal: /\S/,
            contains: [e.C_BLOCK_COMMENT_MODE, n],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "csharp",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          keyword:
            "abstract as base bool break byte case catch char checked const continue decimal default delegate do double enum event explicit extern finally fixed float for foreach goto if implicit in int interface internal is lock long object operator out override params private protected public readonly ref sbyte sealed short sizeof stackalloc static string struct switch this try typeof uint ulong unchecked unsafe ushort using virtual void volatile while add alias ascending async await by descending dynamic equals from get global group into join let nameof on orderby partial remove select set value var when where yield",
          literal: "null false true",
        },
        i = e.inherit(e.TITLE_MODE, { begin: "[a-zA-Z](\\.?\\w)*" }),
        a = {
          className: "number",
          variants: [
            { begin: "\\b(0b[01']+)" },
            {
              begin:
                "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)",
            },
            {
              begin:
                "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
            },
          ],
          relevance: 0,
        },
        s = {
          className: "string",
          begin: '@"',
          end: '"',
          contains: [{ begin: '""' }],
        },
        t = e.inherit(s, { illegal: /\n/ }),
        l = { className: "subst", begin: "{", end: "}", keywords: n },
        r = e.inherit(l, { illegal: /\n/ }),
        c = {
          className: "string",
          begin: /\$"/,
          end: '"',
          illegal: /\n/,
          contains: [{ begin: "{{" }, { begin: "}}" }, e.BACKSLASH_ESCAPE, r],
        },
        o = {
          className: "string",
          begin: /\$@"/,
          end: '"',
          contains: [{ begin: "{{" }, { begin: "}}" }, { begin: '""' }, l],
        },
        g = e.inherit(o, {
          illegal: /\n/,
          contains: [{ begin: "{{" }, { begin: "}}" }, { begin: '""' }, r],
        });
      (l.contains = [
        o,
        c,
        s,
        e.APOS_STRING_MODE,
        e.QUOTE_STRING_MODE,
        a,
        e.C_BLOCK_COMMENT_MODE,
      ]),
        (r.contains = [
          g,
          c,
          t,
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          a,
          e.inherit(e.C_BLOCK_COMMENT_MODE, { illegal: /\n/ }),
        ]);
      var d = { variants: [o, c, s, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE] },
        E = {
          begin: "<",
          end: ">",
          contains: [{ beginKeywords: "in out" }, i],
        },
        _ =
          e.IDENT_RE +
          "(<" +
          e.IDENT_RE +
          "(\\s*,\\s*" +
          e.IDENT_RE +
          ")*>)?(\\[\\])?",
        b = { begin: "@" + e.IDENT_RE, relevance: 0 };
      return {
        name: "C#",
        aliases: ["cs", "c#"],
        keywords: n,
        illegal: /::/,
        contains: [
          e.COMMENT("///", "$", {
            returnBegin: !0,
            contains: [
              {
                className: "doctag",
                variants: [
                  { begin: "///", relevance: 0 },
                  { begin: "\x3c!--|--\x3e" },
                  { begin: "</?", end: ">" },
                ],
              },
            ],
          }),
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          {
            className: "meta",
            begin: "#",
            end: "$",
            keywords: {
              "meta-keyword":
                "if else elif endif define undef warning error line region endregion pragma checksum",
            },
          },
          d,
          a,
          {
            beginKeywords: "class interface",
            end: /[{;=]/,
            illegal: /[^\s:,]/,
            contains: [
              { beginKeywords: "where class" },
              i,
              E,
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          {
            beginKeywords: "namespace",
            end: /[{;=]/,
            illegal: /[^\s:]/,
            contains: [i, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
          },
          {
            className: "meta",
            begin: "^\\s*\\[",
            excludeBegin: !0,
            end: "\\]",
            excludeEnd: !0,
            contains: [{ className: "meta-string", begin: /"/, end: /"/ }],
          },
          { beginKeywords: "new return throw await else", relevance: 0 },
          {
            className: "function",
            begin: "(" + _ + "\\s+)+" + e.IDENT_RE + "\\s*(\\<.+\\>)?\\s*\\(",
            returnBegin: !0,
            end: /\s*[{;=]/,
            excludeEnd: !0,
            keywords: n,
            contains: [
              {
                begin: e.IDENT_RE + "\\s*(\\<.+\\>)?\\s*\\(",
                returnBegin: !0,
                contains: [e.TITLE_MODE, E],
                relevance: 0,
              },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                keywords: n,
                relevance: 0,
                contains: [d, a, e.C_BLOCK_COMMENT_MODE],
              },
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          b,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "python",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          keyword:
            "and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda async await nonlocal|10",
          built_in: "Ellipsis NotImplemented",
          literal: "False None True",
        },
        a = { className: "meta", begin: /^(>>>|\.\.\.) / },
        i = {
          className: "subst",
          begin: /\{/,
          end: /\}/,
          keywords: n,
          illegal: /#/,
        },
        s = { begin: /\{\{/, relevance: 0 },
        r = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE],
          variants: [
            {
              begin: /(u|b)?r?'''/,
              end: /'''/,
              contains: [e.BACKSLASH_ESCAPE, a],
              relevance: 10,
            },
            {
              begin: /(u|b)?r?"""/,
              end: /"""/,
              contains: [e.BACKSLASH_ESCAPE, a],
              relevance: 10,
            },
            {
              begin: /(fr|rf|f)'''/,
              end: /'''/,
              contains: [e.BACKSLASH_ESCAPE, a, s, i],
            },
            {
              begin: /(fr|rf|f)"""/,
              end: /"""/,
              contains: [e.BACKSLASH_ESCAPE, a, s, i],
            },
            { begin: /(u|r|ur)'/, end: /'/, relevance: 10 },
            { begin: /(u|r|ur)"/, end: /"/, relevance: 10 },
            { begin: /(b|br)'/, end: /'/ },
            { begin: /(b|br)"/, end: /"/ },
            {
              begin: /(fr|rf|f)'/,
              end: /'/,
              contains: [e.BACKSLASH_ESCAPE, s, i],
            },
            {
              begin: /(fr|rf|f)"/,
              end: /"/,
              contains: [e.BACKSLASH_ESCAPE, s, i],
            },
            e.APOS_STRING_MODE,
            e.QUOTE_STRING_MODE,
          ],
        },
        l = {
          className: "number",
          relevance: 0,
          variants: [
            { begin: e.BINARY_NUMBER_RE + "[lLjJ]?" },
            { begin: "\\b(0o[0-7]+)[lLjJ]?" },
            { begin: e.C_NUMBER_RE + "[lLjJ]?" },
          ],
        },
        t = {
          className: "params",
          variants: [
            { begin: /\(\s*\)/, skip: !0, className: null },
            {
              begin: /\(/,
              end: /\)/,
              excludeBegin: !0,
              excludeEnd: !0,
              contains: ["self", a, l, r, e.HASH_COMMENT_MODE],
            },
          ],
        };
      return (
        (i.contains = [r, l, a]),
        {
          name: "Python",
          aliases: ["py", "gyp", "ipython"],
          keywords: n,
          illegal: /(<\/|->|\?)|=>/,
          contains: [
            a,
            l,
            { beginKeywords: "if", relevance: 0 },
            r,
            e.HASH_COMMENT_MODE,
            {
              variants: [
                { className: "function", beginKeywords: "def" },
                { className: "class", beginKeywords: "class" },
              ],
              end: /:/,
              illegal: /[${=;\n,]/,
              contains: [
                e.UNDERSCORE_TITLE_MODE,
                t,
                { begin: /->/, endsWithParent: !0, keywords: "None" },
              ],
            },
            { className: "meta", begin: /^[\t ]*@/, end: /$/ },
            { begin: /\b(print|exec)\(/ },
          ],
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "xml",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          className: "symbol",
          begin: "&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;",
        },
        a = {
          begin: "\\s",
          contains: [
            {
              className: "meta-keyword",
              begin: "#?[a-z_][a-z1-9_-]+",
              illegal: "\\n",
            },
          ],
        },
        s = e.inherit(a, { begin: "\\(", end: "\\)" }),
        t = e.inherit(e.APOS_STRING_MODE, { className: "meta-string" }),
        i = e.inherit(e.QUOTE_STRING_MODE, { className: "meta-string" }),
        c = {
          endsWithParent: !0,
          illegal: /</,
          relevance: 0,
          contains: [
            { className: "attr", begin: "[A-Za-z0-9\\._:-]+", relevance: 0 },
            {
              begin: /=\s*/,
              relevance: 0,
              contains: [
                {
                  className: "string",
                  endsParent: !0,
                  variants: [
                    { begin: /"/, end: /"/, contains: [n] },
                    { begin: /'/, end: /'/, contains: [n] },
                    { begin: /[^\s"'=<>`]+/ },
                  ],
                },
              ],
            },
          ],
        };
      return {
        name: "HTML, XML",
        aliases: [
          "html",
          "xhtml",
          "rss",
          "atom",
          "xjb",
          "xsd",
          "xsl",
          "plist",
          "wsf",
          "svg",
        ],
        case_insensitive: !0,
        contains: [
          {
            className: "meta",
            begin: "<![a-z]",
            end: ">",
            relevance: 10,
            contains: [
              a,
              i,
              t,
              s,
              {
                begin: "\\[",
                end: "\\]",
                contains: [
                  {
                    className: "meta",
                    begin: "<![a-z]",
                    end: ">",
                    contains: [a, s, i, t],
                  },
                ],
              },
            ],
          },
          e.COMMENT("\x3c!--", "--\x3e", { relevance: 10 }),
          { begin: "<\\!\\[CDATA\\[", end: "\\]\\]>", relevance: 10 },
          n,
          { className: "meta", begin: /<\?xml/, end: /\?>/, relevance: 10 },
          {
            className: "tag",
            begin: "<style(?=\\s|>)",
            end: ">",
            keywords: { name: "style" },
            contains: [c],
            starts: {
              end: "</style>",
              returnEnd: !0,
              subLanguage: ["css", "xml"],
            },
          },
          {
            className: "tag",
            begin: "<script(?=\\s|>)",
            end: ">",
            keywords: { name: "script" },
            contains: [c],
            starts: {
              end: "</script>",
              returnEnd: !0,
              subLanguage: ["javascript", "handlebars", "xml"],
            },
          },
          {
            className: "tag",
            begin: "</?",
            end: "/?>",
            contains: [
              { className: "name", begin: /[^\/><\s]+/, relevance: 0 },
              c,
            ],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "php-template",
  (function () {
    "use strict";
    return function (n) {
      return {
        name: "PHP template",
        subLanguage: "xml",
        contains: [
          {
            begin: /<\?(php|=)?/,
            end: /\?>/,
            subLanguage: "php",
            contains: [
              { begin: "/\\*", end: "\\*/", skip: !0 },
              { begin: 'b"', end: '"', skip: !0 },
              { begin: "b'", end: "'", skip: !0 },
              n.inherit(n.APOS_STRING_MODE, {
                illegal: null,
                className: null,
                contains: null,
                skip: !0,
              }),
              n.inherit(n.QUOTE_STRING_MODE, {
                illegal: null,
                className: null,
                contains: null,
                skip: !0,
              }),
            ],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "perl",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          $pattern: /[\w.]+/,
          keyword:
            "getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qq fileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmget sub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedir ioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when",
        },
        t = { className: "subst", begin: "[$@]\\{", end: "\\}", keywords: n },
        s = { begin: "->{", end: "}" },
        r = {
          variants: [
            { begin: /\$\d/ },
            { begin: /[\$%@](\^\w\b|#\w+(::\w+)*|{\w+}|\w+(::\w*)*)/ },
            { begin: /[\$%@][^\s\w{]/, relevance: 0 },
          ],
        },
        i = [e.BACKSLASH_ESCAPE, t, r],
        a = [
          r,
          e.HASH_COMMENT_MODE,
          e.COMMENT("^\\=\\w", "\\=cut", { endsWithParent: !0 }),
          s,
          {
            className: "string",
            contains: i,
            variants: [
              { begin: "q[qwxr]?\\s*\\(", end: "\\)", relevance: 5 },
              { begin: "q[qwxr]?\\s*\\[", end: "\\]", relevance: 5 },
              { begin: "q[qwxr]?\\s*\\{", end: "\\}", relevance: 5 },
              { begin: "q[qwxr]?\\s*\\|", end: "\\|", relevance: 5 },
              { begin: "q[qwxr]?\\s*\\<", end: "\\>", relevance: 5 },
              { begin: "qw\\s+q", end: "q", relevance: 5 },
              { begin: "'", end: "'", contains: [e.BACKSLASH_ESCAPE] },
              { begin: '"', end: '"' },
              { begin: "`", end: "`", contains: [e.BACKSLASH_ESCAPE] },
              { begin: "{\\w+}", contains: [], relevance: 0 },
              { begin: "-?\\w+\\s*\\=\\>", contains: [], relevance: 0 },
            ],
          },
          {
            className: "number",
            begin:
              "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
            relevance: 0,
          },
          {
            begin:
              "(\\/\\/|" +
              e.RE_STARTERS_RE +
              "|\\b(split|return|print|reverse|grep)\\b)\\s*",
            keywords: "split return print reverse grep",
            relevance: 0,
            contains: [
              e.HASH_COMMENT_MODE,
              {
                className: "regexp",
                begin: "(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",
                relevance: 10,
              },
              {
                className: "regexp",
                begin: "(m|qr)?/",
                end: "/[a-z]*",
                contains: [e.BACKSLASH_ESCAPE],
                relevance: 0,
              },
            ],
          },
          {
            className: "function",
            beginKeywords: "sub",
            end: "(\\s*\\(.*?\\))?[;{]",
            excludeEnd: !0,
            relevance: 5,
            contains: [e.TITLE_MODE],
          },
          { begin: "-\\w\\b", relevance: 0 },
          {
            begin: "^__DATA__$",
            end: "^__END__$",
            subLanguage: "mojolicious",
            contains: [{ begin: "^@@.*", end: "$", className: "comment" }],
          },
        ];
      return (
        (t.contains = a),
        (s.contains = a),
        { name: "Perl", aliases: ["pl", "pm"], keywords: n, contains: a }
      );
    };
  })()
);
hljs.registerLanguage(
  "nginx",
  (function () {
    "use strict";
    return function (e) {
      var n = {
          className: "variable",
          variants: [
            { begin: /\$\d+/ },
            { begin: /\$\{/, end: /}/ },
            { begin: "[\\$\\@]" + e.UNDERSCORE_IDENT_RE },
          ],
        },
        a = {
          endsWithParent: !0,
          keywords: {
            $pattern: "[a-z/_]+",
            literal:
              "on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll",
          },
          relevance: 0,
          illegal: "=>",
          contains: [
            e.HASH_COMMENT_MODE,
            {
              className: "string",
              contains: [e.BACKSLASH_ESCAPE, n],
              variants: [
                { begin: /"/, end: /"/ },
                { begin: /'/, end: /'/ },
              ],
            },
            {
              begin: "([a-z]+):/",
              end: "\\s",
              endsWithParent: !0,
              excludeEnd: !0,
              contains: [n],
            },
            {
              className: "regexp",
              contains: [e.BACKSLASH_ESCAPE, n],
              variants: [
                { begin: "\\s\\^", end: "\\s|{|;", returnEnd: !0 },
                { begin: "~\\*?\\s+", end: "\\s|{|;", returnEnd: !0 },
                { begin: "\\*(\\.[a-z\\-]+)+" },
                { begin: "([a-z\\-]+\\.)+\\*" },
              ],
            },
            {
              className: "number",
              begin:
                "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b",
            },
            {
              className: "number",
              begin: "\\b\\d+[kKmMgGdshdwy]*\\b",
              relevance: 0,
            },
            n,
          ],
        };
      return {
        name: "Nginx config",
        aliases: ["nginxconf"],
        contains: [
          e.HASH_COMMENT_MODE,
          {
            begin: e.UNDERSCORE_IDENT_RE + "\\s+{",
            returnBegin: !0,
            end: "{",
            contains: [{ className: "section", begin: e.UNDERSCORE_IDENT_RE }],
            relevance: 0,
          },
          {
            begin: e.UNDERSCORE_IDENT_RE + "\\s",
            end: ";|{",
            returnBegin: !0,
            contains: [
              {
                className: "attribute",
                begin: e.UNDERSCORE_IDENT_RE,
                starts: a,
              },
            ],
            relevance: 0,
          },
        ],
        illegal: "[^\\s\\}]",
      };
    };
  })()
);
hljs.registerLanguage(
  "c",
  (function () {
    "use strict";
    return function (e) {
      var n = e.getLanguage("c-like").rawDefinition();
      return (n.name = "C"), (n.aliases = ["c", "h"]), n;
    };
  })()
);
hljs.registerLanguage(
  "javascript",
  (function () {
    "use strict";
    const e = [
        "as",
        "in",
        "of",
        "if",
        "for",
        "while",
        "finally",
        "var",
        "new",
        "function",
        "do",
        "return",
        "void",
        "else",
        "break",
        "catch",
        "instanceof",
        "with",
        "throw",
        "case",
        "default",
        "try",
        "switch",
        "continue",
        "typeof",
        "delete",
        "let",
        "yield",
        "const",
        "class",
        "debugger",
        "async",
        "await",
        "static",
        "import",
        "from",
        "export",
        "extends",
      ],
      n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
      a = [].concat(
        [
          "setInterval",
          "setTimeout",
          "clearInterval",
          "clearTimeout",
          "require",
          "exports",
          "eval",
          "isFinite",
          "isNaN",
          "parseFloat",
          "parseInt",
          "decodeURI",
          "decodeURIComponent",
          "encodeURI",
          "encodeURIComponent",
          "escape",
          "unescape",
        ],
        [
          "arguments",
          "this",
          "super",
          "console",
          "window",
          "document",
          "localStorage",
          "module",
          "global",
        ],
        [
          "Intl",
          "DataView",
          "Number",
          "Math",
          "Date",
          "String",
          "RegExp",
          "Object",
          "Function",
          "Boolean",
          "Error",
          "Symbol",
          "Set",
          "Map",
          "WeakSet",
          "WeakMap",
          "Proxy",
          "Reflect",
          "JSON",
          "Promise",
          "Float64Array",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "Uint16Array",
          "Uint32Array",
          "Float32Array",
          "Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "ArrayBuffer",
        ],
        [
          "EvalError",
          "InternalError",
          "RangeError",
          "ReferenceError",
          "SyntaxError",
          "TypeError",
          "URIError",
        ]
      );
    function s(e) {
      return r("(?=", e, ")");
    }
    function r(...e) {
      return e
        .map((e) =>
          (function (e) {
            return e ? ("string" == typeof e ? e : e.source) : null;
          })(e)
        )
        .join("");
    }
    return function (t) {
      var i = "[A-Za-z$_][0-9A-Za-z$_]*",
        c = { begin: /<[A-Za-z0-9\\._:-]+/, end: /\/[A-Za-z0-9\\._:-]+>|\/>/ },
        o = {
          $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
          keyword: e.join(" "),
          literal: n.join(" "),
          built_in: a.join(" "),
        },
        l = {
          className: "number",
          variants: [
            { begin: "\\b(0[bB][01]+)n?" },
            { begin: "\\b(0[oO][0-7]+)n?" },
            { begin: t.C_NUMBER_RE + "n?" },
          ],
          relevance: 0,
        },
        E = {
          className: "subst",
          begin: "\\$\\{",
          end: "\\}",
          keywords: o,
          contains: [],
        },
        d = {
          begin: "html`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [t.BACKSLASH_ESCAPE, E],
            subLanguage: "xml",
          },
        },
        g = {
          begin: "css`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [t.BACKSLASH_ESCAPE, E],
            subLanguage: "css",
          },
        },
        u = {
          className: "string",
          begin: "`",
          end: "`",
          contains: [t.BACKSLASH_ESCAPE, E],
        };
      E.contains = [
        t.APOS_STRING_MODE,
        t.QUOTE_STRING_MODE,
        d,
        g,
        u,
        l,
        t.REGEXP_MODE,
      ];
      var b = E.contains.concat([
          {
            begin: /\(/,
            end: /\)/,
            contains: ["self"].concat(E.contains, [
              t.C_BLOCK_COMMENT_MODE,
              t.C_LINE_COMMENT_MODE,
            ]),
          },
          t.C_BLOCK_COMMENT_MODE,
          t.C_LINE_COMMENT_MODE,
        ]),
        _ = {
          className: "params",
          begin: /\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          contains: b,
        };
      return {
        name: "JavaScript",
        aliases: ["js", "jsx", "mjs", "cjs"],
        keywords: o,
        contains: [
          t.SHEBANG({ binary: "node", relevance: 5 }),
          {
            className: "meta",
            relevance: 10,
            begin: /^\s*['"]use (strict|asm)['"]/,
          },
          t.APOS_STRING_MODE,
          t.QUOTE_STRING_MODE,
          d,
          g,
          u,
          t.C_LINE_COMMENT_MODE,
          t.COMMENT("/\\*\\*", "\\*/", {
            relevance: 0,
            contains: [
              {
                className: "doctag",
                begin: "@[A-Za-z]+",
                contains: [
                  { className: "type", begin: "\\{", end: "\\}", relevance: 0 },
                  {
                    className: "variable",
                    begin: i + "(?=\\s*(-)|$)",
                    endsParent: !0,
                    relevance: 0,
                  },
                  { begin: /(?=[^\n])\s/, relevance: 0 },
                ],
              },
            ],
          }),
          t.C_BLOCK_COMMENT_MODE,
          l,
          {
            begin: r(
              /[{,\n]\s*/,
              s(r(/(((\/\/.*)|(\/\*(.|\n)*\*\/))\s*)*/, i + "\\s*:"))
            ),
            relevance: 0,
            contains: [
              { className: "attr", begin: i + s("\\s*:"), relevance: 0 },
            ],
          },
          {
            begin: "(" + t.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
            keywords: "return throw case",
            contains: [
              t.C_LINE_COMMENT_MODE,
              t.C_BLOCK_COMMENT_MODE,
              t.REGEXP_MODE,
              {
                className: "function",
                begin:
                  "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" +
                  t.UNDERSCORE_IDENT_RE +
                  ")\\s*=>",
                returnBegin: !0,
                end: "\\s*=>",
                contains: [
                  {
                    className: "params",
                    variants: [
                      { begin: t.UNDERSCORE_IDENT_RE },
                      { className: null, begin: /\(\s*\)/, skip: !0 },
                      {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: !0,
                        excludeEnd: !0,
                        keywords: o,
                        contains: b,
                      },
                    ],
                  },
                ],
              },
              { begin: /,/, relevance: 0 },
              { className: "", begin: /\s/, end: /\s*/, skip: !0 },
              {
                variants: [
                  { begin: "<>", end: "</>" },
                  { begin: c.begin, end: c.end },
                ],
                subLanguage: "xml",
                contains: [
                  { begin: c.begin, end: c.end, skip: !0, contains: ["self"] },
                ],
              },
            ],
            relevance: 0,
          },
          {
            className: "function",
            beginKeywords: "function",
            end: /\{/,
            excludeEnd: !0,
            contains: [t.inherit(t.TITLE_MODE, { begin: i }), _],
            illegal: /\[|%/,
          },
          { begin: /\$[(.]/ },
          t.METHOD_GUARD,
          {
            className: "class",
            beginKeywords: "class",
            end: /[{;=]/,
            excludeEnd: !0,
            illegal: /[:"\[\]]/,
            contains: [{ beginKeywords: "extends" }, t.UNDERSCORE_TITLE_MODE],
          },
          { beginKeywords: "constructor", end: /\{/, excludeEnd: !0 },
          {
            begin: "(get|set)\\s+(?=" + i + "\\()",
            end: /{/,
            keywords: "get set",
            contains: [
              t.inherit(t.TITLE_MODE, { begin: i }),
              { begin: /\(\)/ },
              _,
            ],
          },
        ],
        illegal: /#(?!!)/,
      };
    };
  })()
);
hljs.registerLanguage(
  "plaintext",
  (function () {
    "use strict";
    return function (t) {
      return {
        name: "Plain text",
        aliases: ["text", "txt"],
        disableAutodetect: !0,
      };
    };
  })()
);
hljs.registerLanguage(
  "go",
  (function () {
    "use strict";
    return function (e) {
      var n = {
        keyword:
          "break default func interface select case map struct chan else goto package switch const fallthrough if range type continue for import return var go defer bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 uint16 uint32 uint64 int uint uintptr rune",
        literal: "true false iota nil",
        built_in:
          "append cap close complex copy imag len make new panic print println real recover delete",
      };
      return {
        name: "Go",
        aliases: ["golang"],
        keywords: n,
        illegal: "</",
        contains: [
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          {
            className: "string",
            variants: [
              e.QUOTE_STRING_MODE,
              e.APOS_STRING_MODE,
              { begin: "`", end: "`" },
            ],
          },
          {
            className: "number",
            variants: [
              { begin: e.C_NUMBER_RE + "[i]", relevance: 1 },
              e.C_NUMBER_MODE,
            ],
          },
          { begin: /:=/ },
          {
            className: "function",
            beginKeywords: "func",
            end: "\\s*(\\{|$)",
            excludeEnd: !0,
            contains: [
              e.TITLE_MODE,
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: n,
                illegal: /["']/,
              },
            ],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "markdown",
  (function () {
    "use strict";
    return function (n) {
      const e = { begin: "<", end: ">", subLanguage: "xml", relevance: 0 },
        a = {
          begin: "\\[.+?\\][\\(\\[].*?[\\)\\]]",
          returnBegin: !0,
          contains: [
            {
              className: "string",
              begin: "\\[",
              end: "\\]",
              excludeBegin: !0,
              returnEnd: !0,
              relevance: 0,
            },
            {
              className: "link",
              begin: "\\]\\(",
              end: "\\)",
              excludeBegin: !0,
              excludeEnd: !0,
            },
            {
              className: "symbol",
              begin: "\\]\\[",
              end: "\\]",
              excludeBegin: !0,
              excludeEnd: !0,
            },
          ],
          relevance: 10,
        },
        i = {
          className: "strong",
          contains: [],
          variants: [
            { begin: /_{2}/, end: /_{2}/ },
            { begin: /\*{2}/, end: /\*{2}/ },
          ],
        },
        s = {
          className: "emphasis",
          contains: [],
          variants: [
            { begin: /\*(?!\*)/, end: /\*/ },
            { begin: /_(?!_)/, end: /_/, relevance: 0 },
          ],
        };
      i.contains.push(s), s.contains.push(i);
      var c = [e, a];
      return (
        (i.contains = i.contains.concat(c)),
        (s.contains = s.contains.concat(c)),
        {
          name: "Markdown",
          aliases: ["md", "mkdown", "mkd"],
          contains: [
            {
              className: "section",
              variants: [
                { begin: "^#{1,6}", end: "$", contains: (c = c.concat(i, s)) },
                {
                  begin: "(?=^.+?\\n[=-]{2,}$)",
                  contains: [
                    { begin: "^[=-]*$" },
                    { begin: "^", end: "\\n", contains: c },
                  ],
                },
              ],
            },
            e,
            {
              className: "bullet",
              begin: "^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)",
              end: "\\s+",
              excludeEnd: !0,
            },
            i,
            s,
            { className: "quote", begin: "^>\\s+", contains: c, end: "$" },
            {
              className: "code",
              variants: [
                { begin: "(`{3,})(.|\\n)*?\\1`*[ ]*" },
                { begin: "(~{3,})(.|\\n)*?\\1~*[ ]*" },
                { begin: "```", end: "```+[ ]*$" },
                { begin: "~~~", end: "~~~+[ ]*$" },
                { begin: "`.+?`" },
                {
                  begin: "(?=^( {4}|\\t))",
                  contains: [{ begin: "^( {4}|\\t)", end: "(\\n)$" }],
                  relevance: 0,
                },
              ],
            },
            { begin: "^[-\\*]{3,}", end: "$" },
            a,
            {
              begin: /^\[[^\n]+\]:/,
              returnBegin: !0,
              contains: [
                {
                  className: "symbol",
                  begin: /\[/,
                  end: /\]/,
                  excludeBegin: !0,
                  excludeEnd: !0,
                },
                {
                  className: "link",
                  begin: /:\s*/,
                  end: /$/,
                  excludeBegin: !0,
                },
              ],
            },
          ],
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "bash",
  (function () {
    "use strict";
    return function (e) {
      const s = {};
      Object.assign(s, {
        className: "variable",
        variants: [
          { begin: /\$[\w\d#@][\w\d_]*/ },
          {
            begin: /\$\{/,
            end: /\}/,
            contains: [{ begin: /:-/, contains: [s] }],
          },
        ],
      });
      const t = {
          className: "subst",
          begin: /\$\(/,
          end: /\)/,
          contains: [e.BACKSLASH_ESCAPE],
        },
        n = {
          className: "string",
          begin: /"/,
          end: /"/,
          contains: [e.BACKSLASH_ESCAPE, s, t],
        };
      t.contains.push(n);
      const a = {
          begin: /\$\(\(/,
          end: /\)\)/,
          contains: [
            { begin: /\d+#[0-9a-f]+/, className: "number" },
            e.NUMBER_MODE,
            s,
          ],
        },
        i = e.SHEBANG({
          binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",
          relevance: 10,
        }),
        c = {
          className: "function",
          begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
          returnBegin: !0,
          contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
          relevance: 0,
        };
      return {
        name: "Bash",
        aliases: ["sh", "zsh"],
        keywords: {
          $pattern: /\b-?[a-z\._]+\b/,
          keyword:
            "if then else elif fi for while in do done case esac function",
          literal: "true false",
          built_in:
            "break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp",
          _: "-ne -eq -lt -gt -f -d -e -s -l -a",
        },
        contains: [
          i,
          e.SHEBANG(),
          c,
          a,
          e.HASH_COMMENT_MODE,
          n,
          { className: "", begin: /\\"/ },
          { className: "string", begin: /'/, end: /'/ },
          s,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "ruby",
  (function () {
    "use strict";
    return function (e) {
      var n =
          "[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?",
        a = {
          keyword:
            "and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor",
          literal: "true false nil",
        },
        s = { className: "doctag", begin: "@[A-Za-z]+" },
        i = { begin: "#<", end: ">" },
        r = [
          e.COMMENT("#", "$", { contains: [s] }),
          e.COMMENT("^\\=begin", "^\\=end", { contains: [s], relevance: 10 }),
          e.COMMENT("^__END__", "\\n$"),
        ],
        c = { className: "subst", begin: "#\\{", end: "}", keywords: a },
        t = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE, c],
          variants: [
            { begin: /'/, end: /'/ },
            { begin: /"/, end: /"/ },
            { begin: /`/, end: /`/ },
            { begin: "%[qQwWx]?\\(", end: "\\)" },
            { begin: "%[qQwWx]?\\[", end: "\\]" },
            { begin: "%[qQwWx]?{", end: "}" },
            { begin: "%[qQwWx]?<", end: ">" },
            { begin: "%[qQwWx]?/", end: "/" },
            { begin: "%[qQwWx]?%", end: "%" },
            { begin: "%[qQwWx]?-", end: "-" },
            { begin: "%[qQwWx]?\\|", end: "\\|" },
            {
              begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/,
            },
            {
              begin: /<<[-~]?'?(\w+)(?:.|\n)*?\n\s*\1\b/,
              returnBegin: !0,
              contains: [
                { begin: /<<[-~]?'?/ },
                e.END_SAME_AS_BEGIN({
                  begin: /(\w+)/,
                  end: /(\w+)/,
                  contains: [e.BACKSLASH_ESCAPE, c],
                }),
              ],
            },
          ],
        },
        b = {
          className: "params",
          begin: "\\(",
          end: "\\)",
          endsParent: !0,
          keywords: a,
        },
        d = [
          t,
          i,
          {
            className: "class",
            beginKeywords: "class module",
            end: "$|;",
            illegal: /=/,
            contains: [
              e.inherit(e.TITLE_MODE, {
                begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?",
              }),
              {
                begin: "<\\s*",
                contains: [{ begin: "(" + e.IDENT_RE + "::)?" + e.IDENT_RE }],
              },
            ].concat(r),
          },
          {
            className: "function",
            beginKeywords: "def",
            end: "$|;",
            contains: [e.inherit(e.TITLE_MODE, { begin: n }), b].concat(r),
          },
          { begin: e.IDENT_RE + "::" },
          {
            className: "symbol",
            begin: e.UNDERSCORE_IDENT_RE + "(\\!|\\?)?:",
            relevance: 0,
          },
          {
            className: "symbol",
            begin: ":(?!\\s)",
            contains: [t, { begin: n }],
            relevance: 0,
          },
          {
            className: "number",
            begin:
              "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
            relevance: 0,
          },
          { begin: "(\\$\\W)|((\\$|\\@\\@?)(\\w+))" },
          { className: "params", begin: /\|/, end: /\|/, keywords: a },
          {
            begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
            keywords: "unless",
            contains: [
              i,
              {
                className: "regexp",
                contains: [e.BACKSLASH_ESCAPE, c],
                illegal: /\n/,
                variants: [
                  { begin: "/", end: "/[a-z]*" },
                  { begin: "%r{", end: "}[a-z]*" },
                  { begin: "%r\\(", end: "\\)[a-z]*" },
                  { begin: "%r!", end: "![a-z]*" },
                  { begin: "%r\\[", end: "\\][a-z]*" },
                ],
              },
            ].concat(r),
            relevance: 0,
          },
        ].concat(r);
      (c.contains = d), (b.contains = d);
      var g = [
        { begin: /^\s*=>/, starts: { end: "$", contains: d } },
        {
          className: "meta",
          begin:
            "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+>|(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>)",
          starts: { end: "$", contains: d },
        },
      ];
      return {
        name: "Ruby",
        aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
        keywords: a,
        illegal: /\/\*/,
        contains: r.concat(g).concat(d),
      };
    };
  })()
);
hljs.registerLanguage(
  "yaml",
  (function () {
    "use strict";
    return function (e) {
      var n = "true false yes no null",
        a = "[\\w#;/?:@&=+$,.~*\\'()[\\]]+",
        s = {
          className: "string",
          relevance: 0,
          variants: [
            { begin: /'/, end: /'/ },
            { begin: /"/, end: /"/ },
            { begin: /\S+/ },
          ],
          contains: [
            e.BACKSLASH_ESCAPE,
            {
              className: "template-variable",
              variants: [
                { begin: "{{", end: "}}" },
                { begin: "%{", end: "}" },
              ],
            },
          ],
        },
        i = e.inherit(s, {
          variants: [
            { begin: /'/, end: /'/ },
            { begin: /"/, end: /"/ },
            { begin: /[^\s,{}[\]]+/ },
          ],
        }),
        l = {
          end: ",",
          endsWithParent: !0,
          excludeEnd: !0,
          contains: [],
          keywords: n,
          relevance: 0,
        },
        t = {
          begin: "{",
          end: "}",
          contains: [l],
          illegal: "\\n",
          relevance: 0,
        },
        g = {
          begin: "\\[",
          end: "\\]",
          contains: [l],
          illegal: "\\n",
          relevance: 0,
        },
        b = [
          {
            className: "attr",
            variants: [
              { begin: "\\w[\\w :\\/.-]*:(?=[ \t]|$)" },
              { begin: '"\\w[\\w :\\/.-]*":(?=[ \t]|$)' },
              { begin: "'\\w[\\w :\\/.-]*':(?=[ \t]|$)" },
            ],
          },
          { className: "meta", begin: "^---s*$", relevance: 10 },
          {
            className: "string",
            begin: "[\\|>]([0-9]?[+-])?[ ]*\\n( *)[\\S ]+\\n(\\2[\\S ]+\\n?)*",
          },
          {
            begin: "<%[%=-]?",
            end: "[%-]?%>",
            subLanguage: "ruby",
            excludeBegin: !0,
            excludeEnd: !0,
            relevance: 0,
          },
          { className: "type", begin: "!\\w+!" + a },
          { className: "type", begin: "!<" + a + ">" },
          { className: "type", begin: "!" + a },
          { className: "type", begin: "!!" + a },
          { className: "meta", begin: "&" + e.UNDERSCORE_IDENT_RE + "$" },
          { className: "meta", begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$" },
          { className: "bullet", begin: "\\-(?=[ ]|$)", relevance: 0 },
          e.HASH_COMMENT_MODE,
          { beginKeywords: n, keywords: { literal: n } },
          {
            className: "number",
            begin:
              "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b",
          },
          { className: "number", begin: e.C_NUMBER_RE + "\\b" },
          t,
          g,
          s,
        ],
        c = [...b];
      return (
        c.pop(),
        c.push(i),
        (l.contains = c),
        {
          name: "YAML",
          case_insensitive: !0,
          aliases: ["yml", "YAML"],
          contains: b,
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "properties",
  (function () {
    "use strict";
    return function (e) {
      var n = "[ \\t\\f]*",
        t = "(" + n + "[:=]" + n + "|[ \\t\\f]+)",
        a = "([^\\\\:= \\t\\f\\n]|\\\\.)+",
        s = {
          end: t,
          relevance: 0,
          starts: {
            className: "string",
            end: /$/,
            relevance: 0,
            contains: [{ begin: "\\\\\\n" }],
          },
        };
      return {
        name: ".properties",
        case_insensitive: !0,
        illegal: /\S/,
        contains: [
          e.COMMENT("^\\s*[!#]", "$"),
          {
            begin: "([^\\\\\\W:= \\t\\f\\n]|\\\\.)+" + t,
            returnBegin: !0,
            contains: [
              {
                className: "attr",
                begin: "([^\\\\\\W:= \\t\\f\\n]|\\\\.)+",
                endsParent: !0,
                relevance: 0,
              },
            ],
            starts: s,
          },
          {
            begin: a + t,
            returnBegin: !0,
            relevance: 0,
            contains: [
              { className: "meta", begin: a, endsParent: !0, relevance: 0 },
            ],
            starts: s,
          },
          { className: "attr", relevance: 0, begin: a + n + "$" },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "typescript",
  (function () {
    "use strict";
    const e = [
        "as",
        "in",
        "of",
        "if",
        "for",
        "while",
        "finally",
        "var",
        "new",
        "function",
        "do",
        "return",
        "void",
        "else",
        "break",
        "catch",
        "instanceof",
        "with",
        "throw",
        "case",
        "default",
        "try",
        "switch",
        "continue",
        "typeof",
        "delete",
        "let",
        "yield",
        "const",
        "class",
        "debugger",
        "async",
        "await",
        "static",
        "import",
        "from",
        "export",
        "extends",
      ],
      n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
      a = [].concat(
        [
          "setInterval",
          "setTimeout",
          "clearInterval",
          "clearTimeout",
          "require",
          "exports",
          "eval",
          "isFinite",
          "isNaN",
          "parseFloat",
          "parseInt",
          "decodeURI",
          "decodeURIComponent",
          "encodeURI",
          "encodeURIComponent",
          "escape",
          "unescape",
        ],
        [
          "arguments",
          "this",
          "super",
          "console",
          "window",
          "document",
          "localStorage",
          "module",
          "global",
        ],
        [
          "Intl",
          "DataView",
          "Number",
          "Math",
          "Date",
          "String",
          "RegExp",
          "Object",
          "Function",
          "Boolean",
          "Error",
          "Symbol",
          "Set",
          "Map",
          "WeakSet",
          "WeakMap",
          "Proxy",
          "Reflect",
          "JSON",
          "Promise",
          "Float64Array",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "Uint16Array",
          "Uint32Array",
          "Float32Array",
          "Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "ArrayBuffer",
        ],
        [
          "EvalError",
          "InternalError",
          "RangeError",
          "ReferenceError",
          "SyntaxError",
          "TypeError",
          "URIError",
        ]
      );
    return function (r) {
      var t = {
          $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
          keyword: e
            .concat([
              "type",
              "namespace",
              "typedef",
              "interface",
              "public",
              "private",
              "protected",
              "implements",
              "declare",
              "abstract",
              "readonly",
            ])
            .join(" "),
          literal: n.join(" "),
          built_in: a
            .concat([
              "any",
              "void",
              "number",
              "boolean",
              "string",
              "object",
              "never",
              "enum",
            ])
            .join(" "),
        },
        s = { className: "meta", begin: "@[A-Za-z$_][0-9A-Za-z$_]*" },
        i = {
          className: "number",
          variants: [
            { begin: "\\b(0[bB][01]+)n?" },
            { begin: "\\b(0[oO][0-7]+)n?" },
            { begin: r.C_NUMBER_RE + "n?" },
          ],
          relevance: 0,
        },
        o = {
          className: "subst",
          begin: "\\$\\{",
          end: "\\}",
          keywords: t,
          contains: [],
        },
        c = {
          begin: "html`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [r.BACKSLASH_ESCAPE, o],
            subLanguage: "xml",
          },
        },
        l = {
          begin: "css`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [r.BACKSLASH_ESCAPE, o],
            subLanguage: "css",
          },
        },
        E = {
          className: "string",
          begin: "`",
          end: "`",
          contains: [r.BACKSLASH_ESCAPE, o],
        };
      o.contains = [
        r.APOS_STRING_MODE,
        r.QUOTE_STRING_MODE,
        c,
        l,
        E,
        i,
        r.REGEXP_MODE,
      ];
      var d = {
          begin: "\\(",
          end: /\)/,
          keywords: t,
          contains: [
            "self",
            r.QUOTE_STRING_MODE,
            r.APOS_STRING_MODE,
            r.NUMBER_MODE,
          ],
        },
        u = {
          className: "params",
          begin: /\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          keywords: t,
          contains: [r.C_LINE_COMMENT_MODE, r.C_BLOCK_COMMENT_MODE, s, d],
        };
      return {
        name: "TypeScript",
        aliases: ["ts"],
        keywords: t,
        contains: [
          r.SHEBANG(),
          { className: "meta", begin: /^\s*['"]use strict['"]/ },
          r.APOS_STRING_MODE,
          r.QUOTE_STRING_MODE,
          c,
          l,
          E,
          r.C_LINE_COMMENT_MODE,
          r.C_BLOCK_COMMENT_MODE,
          i,
          {
            begin: "(" + r.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
            keywords: "return throw case",
            contains: [
              r.C_LINE_COMMENT_MODE,
              r.C_BLOCK_COMMENT_MODE,
              r.REGEXP_MODE,
              {
                className: "function",
                begin:
                  "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" +
                  r.UNDERSCORE_IDENT_RE +
                  ")\\s*=>",
                returnBegin: !0,
                end: "\\s*=>",
                contains: [
                  {
                    className: "params",
                    variants: [
                      { begin: r.UNDERSCORE_IDENT_RE },
                      { className: null, begin: /\(\s*\)/, skip: !0 },
                      {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: !0,
                        excludeEnd: !0,
                        keywords: t,
                        contains: d.contains,
                      },
                    ],
                  },
                ],
              },
            ],
            relevance: 0,
          },
          {
            className: "function",
            beginKeywords: "function",
            end: /[\{;]/,
            excludeEnd: !0,
            keywords: t,
            contains: [
              "self",
              r.inherit(r.TITLE_MODE, { begin: "[A-Za-z$_][0-9A-Za-z$_]*" }),
              u,
            ],
            illegal: /%/,
            relevance: 0,
          },
          {
            beginKeywords: "constructor",
            end: /[\{;]/,
            excludeEnd: !0,
            contains: ["self", u],
          },
          { begin: /module\./, keywords: { built_in: "module" }, relevance: 0 },
          { beginKeywords: "module", end: /\{/, excludeEnd: !0 },
          {
            beginKeywords: "interface",
            end: /\{/,
            excludeEnd: !0,
            keywords: "interface extends",
          },
          { begin: /\$[(.]/ },
          { begin: "\\." + r.IDENT_RE, relevance: 0 },
          s,
          d,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "xquery",
  (function () {
    "use strict";
    return function (e) {
      return {
        name: "XQuery",
        aliases: ["xpath", "xq"],
        case_insensitive: !1,
        illegal: /(proc)|(abstract)|(extends)|(until)|(#)/,
        keywords: {
          $pattern: /[a-zA-Z\$][a-zA-Z0-9_:\-]*/,
          keyword:
            "module schema namespace boundary-space preserve no-preserve strip default collation base-uri ordering context decimal-format decimal-separator copy-namespaces empty-sequence except exponent-separator external grouping-separator inherit no-inherit lax minus-sign per-mille percent schema-attribute schema-element strict unordered zero-digit declare import option function validate variable for at in let where order group by return if then else tumbling sliding window start when only end previous next stable ascending descending allowing empty greatest least some every satisfies switch case typeswitch try catch and or to union intersect instance of treat as castable cast map array delete insert into replace value rename copy modify update",
          type:
            "item document-node node attribute document element comment namespace namespace-node processing-instruction text construction xs:anyAtomicType xs:untypedAtomic xs:duration xs:time xs:decimal xs:float xs:double xs:gYearMonth xs:gYear xs:gMonthDay xs:gMonth xs:gDay xs:boolean xs:base64Binary xs:hexBinary xs:anyURI xs:QName xs:NOTATION xs:dateTime xs:dateTimeStamp xs:date xs:string xs:normalizedString xs:token xs:language xs:NMTOKEN xs:Name xs:NCName xs:ID xs:IDREF xs:ENTITY xs:integer xs:nonPositiveInteger xs:negativeInteger xs:long xs:int xs:short xs:byte xs:nonNegativeInteger xs:unisignedLong xs:unsignedInt xs:unsignedShort xs:unsignedByte xs:positiveInteger xs:yearMonthDuration xs:dayTimeDuration",
          literal:
            "eq ne lt le gt ge is self:: child:: descendant:: descendant-or-self:: attribute:: following:: following-sibling:: parent:: ancestor:: ancestor-or-self:: preceding:: preceding-sibling:: NaN",
        },
        contains: [
          { className: "variable", begin: /[\$][\w-:]+/ },
          {
            className: "built_in",
            variants: [
              {
                begin: /\barray\:/,
                end: /(?:append|filter|flatten|fold\-(?:left|right)|for-each(?:\-pair)?|get|head|insert\-before|join|put|remove|reverse|size|sort|subarray|tail)\b/,
              },
              {
                begin: /\bmap\:/,
                end: /(?:contains|entry|find|for\-each|get|keys|merge|put|remove|size)\b/,
              },
              {
                begin: /\bmath\:/,
                end: /(?:a(?:cos|sin|tan[2]?)|cos|exp(?:10)?|log(?:10)?|pi|pow|sin|sqrt|tan)\b/,
              },
              { begin: /\bop\:/, end: /\(/, excludeEnd: !0 },
              { begin: /\bfn\:/, end: /\(/, excludeEnd: !0 },
              {
                begin: /[^<\/\$\:'"-]\b(?:abs|accumulator\-(?:after|before)|adjust\-(?:date(?:Time)?|time)\-to\-timezone|analyze\-string|apply|available\-(?:environment\-variables|system\-properties)|avg|base\-uri|boolean|ceiling|codepoints?\-(?:equal|to\-string)|collation\-key|collection|compare|concat|contains(?:\-token)?|copy\-of|count|current(?:\-)?(?:date(?:Time)?|time|group(?:ing\-key)?|output\-uri|merge\-(?:group|key))?data|dateTime|days?\-from\-(?:date(?:Time)?|duration)|deep\-equal|default\-(?:collation|language)|distinct\-values|document(?:\-uri)?|doc(?:\-available)?|element\-(?:available|with\-id)|empty|encode\-for\-uri|ends\-with|environment\-variable|error|escape\-html\-uri|exactly\-one|exists|false|filter|floor|fold\-(?:left|right)|for\-each(?:\-pair)?|format\-(?:date(?:Time)?|time|integer|number)|function\-(?:arity|available|lookup|name)|generate\-id|has\-children|head|hours\-from\-(?:dateTime|duration|time)|id(?:ref)?|implicit\-timezone|in\-scope\-prefixes|index\-of|innermost|insert\-before|iri\-to\-uri|json\-(?:doc|to\-xml)|key|lang|last|load\-xquery\-module|local\-name(?:\-from\-QName)?|(?:lower|upper)\-case|matches|max|minutes\-from\-(?:dateTime|duration|time)|min|months?\-from\-(?:date(?:Time)?|duration)|name(?:space\-uri\-?(?:for\-prefix|from\-QName)?)?|nilled|node\-name|normalize\-(?:space|unicode)|not|number|one\-or\-more|outermost|parse\-(?:ietf\-date|json)|path|position|(?:prefix\-from\-)?QName|random\-number\-generator|regex\-group|remove|replace|resolve\-(?:QName|uri)|reverse|root|round(?:\-half\-to\-even)?|seconds\-from\-(?:dateTime|duration|time)|snapshot|sort|starts\-with|static\-base\-uri|stream\-available|string\-?(?:join|length|to\-codepoints)?|subsequence|substring\-?(?:after|before)?|sum|system\-property|tail|timezone\-from\-(?:date(?:Time)?|time)|tokenize|trace|trans(?:form|late)|true|type\-available|unordered|unparsed\-(?:entity|text)?\-?(?:public\-id|uri|available|lines)?|uri\-collection|xml\-to\-json|years?\-from\-(?:date(?:Time)?|duration)|zero\-or\-one)\b/,
              },
              { begin: /\blocal\:/, end: /\(/, excludeEnd: !0 },
              {
                begin: /\bzip\:/,
                end: /(?:zip\-file|(?:xml|html|text|binary)\-entry| (?:update\-)?entries)\b/,
              },
              {
                begin: /\b(?:util|db|functx|app|xdmp|xmldb)\:/,
                end: /\(/,
                excludeEnd: !0,
              },
            ],
          },
          {
            className: "string",
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [{ begin: /""/, relevance: 0 }],
              },
              {
                begin: /'/,
                end: /'/,
                contains: [{ begin: /''/, relevance: 0 }],
              },
            ],
          },
          {
            className: "number",
            begin:
              "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
            relevance: 0,
          },
          {
            className: "comment",
            begin: "\\(:",
            end: ":\\)",
            relevance: 10,
            contains: [{ className: "doctag", begin: "@\\w+" }],
          },
          { className: "meta", begin: /%[\w-:]+/ },
          {
            className: "title",
            begin: /\bxquery version "[13]\.[01]"\s?(?:encoding ".+")?/,
            end: /;/,
          },
          {
            beginKeywords:
              "element attribute comment document processing-instruction",
            end: "{",
            excludeEnd: !0,
          },
          {
            begin: /<([\w\._:\-]+)((\s*.*)=('|").*('|"))?>/,
            end: /(\/[\w\._:\-]+>)/,
            subLanguage: "xml",
            contains: [{ begin: "{", end: "}", subLanguage: "xquery" }, "self"],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "json",
  (function () {
    "use strict";
    return function (n) {
      var e = { literal: "true false null" },
        i = [n.C_LINE_COMMENT_MODE, n.C_BLOCK_COMMENT_MODE],
        t = [n.QUOTE_STRING_MODE, n.C_NUMBER_MODE],
        a = {
          end: ",",
          endsWithParent: !0,
          excludeEnd: !0,
          contains: t,
          keywords: e,
        },
        l = {
          begin: "{",
          end: "}",
          contains: [
            {
              className: "attr",
              begin: /"/,
              end: /"/,
              contains: [n.BACKSLASH_ESCAPE],
              illegal: "\\n",
            },
            n.inherit(a, { begin: /:/ }),
          ].concat(i),
          illegal: "\\S",
        },
        s = {
          begin: "\\[",
          end: "\\]",
          contains: [n.inherit(a)],
          illegal: "\\S",
        };
      return (
        t.push(l, s),
        i.forEach(function (n) {
          t.push(n);
        }),
        { name: "JSON", contains: t, keywords: e, illegal: "\\S" }
      );
    };
  })()
);
hljs.registerLanguage(
  "sql",
  (function () {
    "use strict";
    return function (e) {
      var t = e.COMMENT("--", "$");
      return {
        name: "SQL",
        case_insensitive: !0,
        illegal: /[<>{}*]/,
        contains: [
          {
            beginKeywords:
              "begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke comment values with",
            end: /;/,
            endsWithParent: !0,
            keywords: {
              $pattern: /[\w\.]+/,
              keyword:
                "as abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias all allocate allow alter always analyze ancillary and anti any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound bucket buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain explode export export_set extended extent external external_1 external_2 externally extract failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force foreign form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour hours http id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lateral lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minutes minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notnull notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second seconds section securefile security seed segment select self semi sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tablesample tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unnest unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace window with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",
              literal: "true false null unknown",
              built_in:
                "array bigint binary bit blob bool boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text time timestamp tinyint varchar varchar2 varying void",
            },
            contains: [
              {
                className: "string",
                begin: "'",
                end: "'",
                contains: [{ begin: "''" }],
              },
              {
                className: "string",
                begin: '"',
                end: '"',
                contains: [{ begin: '""' }],
              },
              { className: "string", begin: "`", end: "`" },
              e.C_NUMBER_MODE,
              e.C_BLOCK_COMMENT_MODE,
              t,
              e.HASH_COMMENT_MODE,
            ],
          },
          e.C_BLOCK_COMMENT_MODE,
          t,
          e.HASH_COMMENT_MODE,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "scss",
  (function () {
    "use strict";
    return function (e) {
      var t = {
          className: "variable",
          begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b",
        },
        i = { className: "number", begin: "#[0-9A-Fa-f]+" };
      return (
        e.CSS_NUMBER_MODE,
        e.QUOTE_STRING_MODE,
        e.APOS_STRING_MODE,
        e.C_BLOCK_COMMENT_MODE,
        {
          name: "SCSS",
          case_insensitive: !0,
          illegal: "[=/|']",
          contains: [
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            {
              className: "selector-id",
              begin: "\\#[A-Za-z0-9_-]+",
              relevance: 0,
            },
            {
              className: "selector-class",
              begin: "\\.[A-Za-z0-9_-]+",
              relevance: 0,
            },
            {
              className: "selector-attr",
              begin: "\\[",
              end: "\\]",
              illegal: "$",
            },
            {
              className: "selector-tag",
              begin:
                "\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b",
              relevance: 0,
            },
            {
              className: "selector-pseudo",
              begin:
                ":(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)",
            },
            {
              className: "selector-pseudo",
              begin:
                "::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)",
            },
            t,
            {
              className: "attribute",
              begin:
                "\\b(src|z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background-blend-mode|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b",
              illegal: "[^\\s]",
            },
            {
              begin:
                "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b",
            },
            {
              begin: ":",
              end: ";",
              contains: [
                t,
                i,
                e.CSS_NUMBER_MODE,
                e.QUOTE_STRING_MODE,
                e.APOS_STRING_MODE,
                { className: "meta", begin: "!important" },
              ],
            },
            {
              begin: "@(page|font-face)",
              lexemes: "@[a-z-]+",
              keywords: "@page @font-face",
            },
            {
              begin: "@",
              end: "[{;]",
              returnBegin: !0,
              keywords: "and or not only",
              contains: [
                { begin: "@[a-z-]+", className: "keyword" },
                t,
                e.QUOTE_STRING_MODE,
                e.APOS_STRING_MODE,
                i,
                e.CSS_NUMBER_MODE,
              ],
            },
          ],
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "makefile",
  (function () {
    "use strict";
    return function (e) {
      var i = {
          className: "variable",
          variants: [
            {
              begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
              contains: [e.BACKSLASH_ESCAPE],
            },
            { begin: /\$[@%<?\^\+\*]/ },
          ],
        },
        n = {
          className: "string",
          begin: /"/,
          end: /"/,
          contains: [e.BACKSLASH_ESCAPE, i],
        },
        a = {
          className: "variable",
          begin: /\$\([\w-]+\s/,
          end: /\)/,
          keywords: {
            built_in:
              "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value",
          },
          contains: [i],
        },
        r = { begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)" },
        s = {
          className: "section",
          begin: /^[^\s]+:/,
          end: /$/,
          contains: [i],
        };
      return {
        name: "Makefile",
        aliases: ["mk", "mak"],
        keywords: {
          $pattern: /[\w-]+/,
          keyword:
            "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath",
        },
        contains: [
          e.HASH_COMMENT_MODE,
          i,
          n,
          a,
          r,
          {
            className: "meta",
            begin: /^\.PHONY:/,
            end: /$/,
            keywords: { $pattern: /[\.\w]+/, "meta-keyword": ".PHONY" },
          },
          s,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "cpp",
  (function () {
    "use strict";
    return function (e) {
      var t = e.getLanguage("c-like").rawDefinition();
      return (
        (t.disableAutodetect = !1),
        (t.name = "C++"),
        (t.aliases = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"]),
        t
      );
    };
  })()
);
hljs.registerLanguage(
  "less",
  (function () {
    "use strict";
    return function (e) {
      var n = "([\\w-]+|@{[\\w-]+})",
        a = [],
        s = [],
        t = function (e) {
          return { className: "string", begin: "~?" + e + ".*?" + e };
        },
        r = function (e, n, a) {
          return { className: e, begin: n, relevance: a };
        },
        i = { begin: "\\(", end: "\\)", contains: s, relevance: 0 };
      s.push(
        e.C_LINE_COMMENT_MODE,
        e.C_BLOCK_COMMENT_MODE,
        t("'"),
        t('"'),
        e.CSS_NUMBER_MODE,
        {
          begin: "(url|data-uri)\\(",
          starts: { className: "string", end: "[\\)\\n]", excludeEnd: !0 },
        },
        r("number", "#[0-9A-Fa-f]+\\b"),
        i,
        r("variable", "@@?[\\w-]+", 10),
        r("variable", "@{[\\w-]+}"),
        r("built_in", "~?`[^`]*?`"),
        {
          className: "attribute",
          begin: "[\\w-]+\\s*:",
          end: ":",
          returnBegin: !0,
          excludeEnd: !0,
        },
        { className: "meta", begin: "!important" }
      );
      var c = s.concat({ begin: "{", end: "}", contains: a }),
        l = {
          beginKeywords: "when",
          endsWithParent: !0,
          contains: [{ beginKeywords: "and not" }].concat(s),
        },
        o = {
          begin: n + "\\s*:",
          returnBegin: !0,
          end: "[;}]",
          relevance: 0,
          contains: [
            {
              className: "attribute",
              begin: n,
              end: ":",
              excludeEnd: !0,
              starts: {
                endsWithParent: !0,
                illegal: "[<=$]",
                relevance: 0,
                contains: s,
              },
            },
          ],
        },
        g = {
          className: "keyword",
          begin:
            "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
          starts: { end: "[;{}]", returnEnd: !0, contains: s, relevance: 0 },
        },
        d = {
          className: "variable",
          variants: [
            { begin: "@[\\w-]+\\s*:", relevance: 15 },
            { begin: "@[\\w-]+" },
          ],
          starts: { end: "[;}]", returnEnd: !0, contains: c },
        },
        b = {
          variants: [
            { begin: "[\\.#:&\\[>]", end: "[;{}]" },
            { begin: n, end: "{" },
          ],
          returnBegin: !0,
          returnEnd: !0,
          illegal: "[<='$\"]",
          relevance: 0,
          contains: [
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            l,
            r("keyword", "all\\b"),
            r("variable", "@{[\\w-]+}"),
            r("selector-tag", n + "%?", 0),
            r("selector-id", "#" + n),
            r("selector-class", "\\." + n, 0),
            r("selector-tag", "&", 0),
            { className: "selector-attr", begin: "\\[", end: "\\]" },
            {
              className: "selector-pseudo",
              begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/,
            },
            { begin: "\\(", end: "\\)", contains: c },
            { begin: "!important" },
          ],
        };
      return (
        a.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, g, d, o, b),
        {
          name: "Less",
          case_insensitive: !0,
          illegal: "[=>'/<($\"]",
          contains: a,
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "rust",
  (function () {
    "use strict";
    return function (e) {
      var n = "([ui](8|16|32|64|128|size)|f(32|64))?",
        t =
          "drop i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 str char bool Box Option Result String Vec Copy Send Sized Sync Drop Fn FnMut FnOnce ToOwned Clone Debug PartialEq PartialOrd Eq Ord AsRef AsMut Into From Default Iterator Extend IntoIterator DoubleEndedIterator ExactSizeIterator SliceConcatExt ToString assert! assert_eq! bitflags! bytes! cfg! col! concat! concat_idents! debug_assert! debug_assert_eq! env! panic! file! format! format_args! include_bin! include_str! line! local_data_key! module_path! option_env! print! println! select! stringify! try! unimplemented! unreachable! vec! write! writeln! macro_rules! assert_ne! debug_assert_ne!";
      return {
        name: "Rust",
        aliases: ["rs"],
        keywords: {
          $pattern: e.IDENT_RE + "!?",
          keyword:
            "abstract as async await become box break const continue crate do dyn else enum extern false final fn for if impl in let loop macro match mod move mut override priv pub ref return self Self static struct super trait true try type typeof unsafe unsized use virtual where while yield",
          literal: "true false Some None Ok Err",
          built_in: t,
        },
        illegal: "</",
        contains: [
          e.C_LINE_COMMENT_MODE,
          e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
          e.inherit(e.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null }),
          {
            className: "string",
            variants: [
              { begin: /r(#*)"(.|\n)*?"\1(?!#)/ },
              { begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/ },
            ],
          },
          { className: "symbol", begin: /'[a-zA-Z_][a-zA-Z0-9_]*/ },
          {
            className: "number",
            variants: [
              { begin: "\\b0b([01_]+)" + n },
              { begin: "\\b0o([0-7_]+)" + n },
              { begin: "\\b0x([A-Fa-f0-9_]+)" + n },
              { begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + n },
            ],
            relevance: 0,
          },
          {
            className: "function",
            beginKeywords: "fn",
            end: "(\\(|<)",
            excludeEnd: !0,
            contains: [e.UNDERSCORE_TITLE_MODE],
          },
          {
            className: "meta",
            begin: "#\\!?\\[",
            end: "\\]",
            contains: [{ className: "meta-string", begin: /"/, end: /"/ }],
          },
          {
            className: "class",
            beginKeywords: "type",
            end: ";",
            contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, { endsParent: !0 })],
            illegal: "\\S",
          },
          {
            className: "class",
            beginKeywords: "trait enum struct union",
            end: "{",
            contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, { endsParent: !0 })],
            illegal: "[\\w\\d]",
          },
          { begin: e.IDENT_RE + "::", keywords: { built_in: t } },
          { begin: "->" },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "http",
  (function () {
    "use strict";
    return function (e) {
      var n = "HTTP/[0-9\\.]+";
      return {
        name: "HTTP",
        aliases: ["https"],
        illegal: "\\S",
        contains: [
          {
            begin: "^" + n,
            end: "$",
            contains: [{ className: "number", begin: "\\b\\d{3}\\b" }],
          },
          {
            begin: "^[A-Z]+ (.*?) " + n + "$",
            returnBegin: !0,
            end: "$",
            contains: [
              {
                className: "string",
                begin: " ",
                end: " ",
                excludeBegin: !0,
                excludeEnd: !0,
              },
              { begin: n },
              { className: "keyword", begin: "[A-Z]+" },
            ],
          },
          {
            className: "attribute",
            begin: "^\\w",
            end: ": ",
            excludeEnd: !0,
            illegal: "\\n|\\s|=",
            starts: { end: "$", relevance: 0 },
          },
          { begin: "\\n\\n", starts: { subLanguage: [], endsWithParent: !0 } },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "swift",
  (function () {
    "use strict";
    return function (e) {
      var i = {
          keyword:
            "#available #colorLiteral #column #else #elseif #endif #file #fileLiteral #function #if #imageLiteral #line #selector #sourceLocation _ __COLUMN__ __FILE__ __FUNCTION__ __LINE__ Any as as! as? associatedtype associativity break case catch class continue convenience default defer deinit didSet do dynamic dynamicType else enum extension fallthrough false fileprivate final for func get guard if import in indirect infix init inout internal is lazy left let mutating nil none nonmutating open operator optional override postfix precedence prefix private protocol Protocol public repeat required rethrows return right self Self set static struct subscript super switch throw throws true try try! try? Type typealias unowned var weak where while willSet",
          literal: "true false nil",
          built_in:
            "abs advance alignof alignofValue anyGenerator assert assertionFailure bridgeFromObjectiveC bridgeFromObjectiveCUnconditional bridgeToObjectiveC bridgeToObjectiveCUnconditional c compactMap contains count countElements countLeadingZeros debugPrint debugPrintln distance dropFirst dropLast dump encodeBitsAsWords enumerate equal fatalError filter find getBridgedObjectiveCType getVaList indices insertionSort isBridgedToObjectiveC isBridgedVerbatimToObjectiveC isUniquelyReferenced isUniquelyReferencedNonObjC join lazy lexicographicalCompare map max maxElement min minElement numericCast overlaps partition posix precondition preconditionFailure print println quickSort readLine reduce reflect reinterpretCast reverse roundUpToAlignment sizeof sizeofValue sort split startsWith stride strideof strideofValue swap toString transcode underestimateCount unsafeAddressOf unsafeBitCast unsafeDowncast unsafeUnwrap unsafeReflect withExtendedLifetime withObjectAtPlusZero withUnsafePointer withUnsafePointerToObject withUnsafeMutablePointer withUnsafeMutablePointers withUnsafePointer withUnsafePointers withVaList zip",
        },
        n = e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
        t = {
          className: "subst",
          begin: /\\\(/,
          end: "\\)",
          keywords: i,
          contains: [],
        },
        a = {
          className: "string",
          contains: [e.BACKSLASH_ESCAPE, t],
          variants: [
            { begin: /"""/, end: /"""/ },
            { begin: /"/, end: /"/ },
          ],
        },
        r = {
          className: "number",
          begin:
            "\\b([\\d_]+(\\.[\\deE_]+)?|0x[a-fA-F0-9_]+(\\.[a-fA-F0-9p_]+)?|0b[01_]+|0o[0-7_]+)\\b",
          relevance: 0,
        };
      return (
        (t.contains = [r]),
        {
          name: "Swift",
          keywords: i,
          contains: [
            a,
            e.C_LINE_COMMENT_MODE,
            n,
            { className: "type", begin: "\\b[A-Z][\\wÀ-ʸ']*[!?]" },
            { className: "type", begin: "\\b[A-Z][\\wÀ-ʸ']*", relevance: 0 },
            r,
            {
              className: "function",
              beginKeywords: "func",
              end: "{",
              excludeEnd: !0,
              contains: [
                e.inherit(e.TITLE_MODE, { begin: /[A-Za-z$_][0-9A-Za-z$_]*/ }),
                { begin: /</, end: />/ },
                {
                  className: "params",
                  begin: /\(/,
                  end: /\)/,
                  endsParent: !0,
                  keywords: i,
                  contains: [
                    "self",
                    r,
                    a,
                    e.C_BLOCK_COMMENT_MODE,
                    { begin: ":" },
                  ],
                  illegal: /["']/,
                },
              ],
              illegal: /\[|%/,
            },
            {
              className: "class",
              beginKeywords: "struct protocol class extension enum",
              keywords: i,
              end: "\\{",
              excludeEnd: !0,
              contains: [
                e.inherit(e.TITLE_MODE, {
                  begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/,
                }),
              ],
            },
            {
              className: "meta",
              begin:
                "(@discardableResult|@warn_unused_result|@exported|@lazy|@noescape|@NSCopying|@NSManaged|@objc|@objcMembers|@convention|@required|@noreturn|@IBAction|@IBDesignable|@IBInspectable|@IBOutlet|@infix|@prefix|@postfix|@autoclosure|@testable|@available|@nonobjc|@NSApplicationMain|@UIApplicationMain|@dynamicMemberLookup|@propertyWrapper)\\b",
            },
            {
              beginKeywords: "import",
              end: /$/,
              contains: [e.C_LINE_COMMENT_MODE, n],
            },
          ],
        }
      );
    };
  })()
);
hljs.registerLanguage(
  "ini",
  (function () {
    "use strict";
    function e(e) {
      return e ? ("string" == typeof e ? e : e.source) : null;
    }
    function n(...n) {
      return n.map((n) => e(n)).join("");
    }
    return function (a) {
      var s = {
          className: "number",
          relevance: 0,
          variants: [
            { begin: /([\+\-]+)?[\d]+_[\d_]+/ },
            { begin: a.NUMBER_RE },
          ],
        },
        i = a.COMMENT();
      i.variants = [
        { begin: /;/, end: /$/ },
        { begin: /#/, end: /$/ },
      ];
      var t = {
          className: "variable",
          variants: [{ begin: /\$[\w\d"][\w\d_]*/ }, { begin: /\$\{(.*?)}/ }],
        },
        r = { className: "literal", begin: /\bon|off|true|false|yes|no\b/ },
        l = {
          className: "string",
          contains: [a.BACKSLASH_ESCAPE],
          variants: [
            { begin: "'''", end: "'''", relevance: 10 },
            { begin: '"""', end: '"""', relevance: 10 },
            { begin: '"', end: '"' },
            { begin: "'", end: "'" },
          ],
        },
        c = {
          begin: /\[/,
          end: /\]/,
          contains: [i, r, t, l, s, "self"],
          relevance: 0,
        },
        g =
          "(" +
          [/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/]
            .map((n) => e(n))
            .join("|") +
          ")";
      return {
        name: "TOML, also INI",
        aliases: ["toml"],
        case_insensitive: !0,
        illegal: /\S/,
        contains: [
          i,
          { className: "section", begin: /\[+/, end: /\]+/ },
          {
            begin: n(
              g,
              "(\\s*\\.\\s*",
              g,
              ")*",
              n("(?=", /\s*=\s*[^#\s]/, ")")
            ),
            className: "attr",
            starts: { end: /$/, contains: [i, c, r, t, l, s] },
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "shell",
  (function () {
    "use strict";
    return function (s) {
      return {
        name: "Shell Session",
        aliases: ["console"],
        contains: [
          {
            className: "meta",
            begin: "^\\s{0,3}[/\\w\\d\\[\\]()@-]*[>%$#]",
            starts: { end: "$", subLanguage: "bash" },
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "lua",
  (function () {
    "use strict";
    return function (e) {
      var t = { begin: "\\[=*\\[", end: "\\]=*\\]", contains: ["self"] },
        a = [
          e.COMMENT("--(?!\\[=*\\[)", "$"),
          e.COMMENT("--\\[=*\\[", "\\]=*\\]", { contains: [t], relevance: 10 }),
        ];
      return {
        name: "Lua",
        keywords: {
          $pattern: e.UNDERSCORE_IDENT_RE,
          literal: "true false nil",
          keyword:
            "and break do else elseif end for goto if in local not or repeat return then until while",
          built_in:
            "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove",
        },
        contains: a.concat([
          {
            className: "function",
            beginKeywords: "function",
            end: "\\)",
            contains: [
              e.inherit(e.TITLE_MODE, {
                begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*",
              }),
              {
                className: "params",
                begin: "\\(",
                endsWithParent: !0,
                contains: a,
              },
            ].concat(a),
          },
          e.C_NUMBER_MODE,
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          {
            className: "string",
            begin: "\\[=*\\[",
            end: "\\]=*\\]",
            contains: [t],
            relevance: 5,
          },
        ]),
      };
    };
  })()
);
hljs.registerLanguage(
  "java",
  (function () {
    "use strict";
    function e(e) {
      return e ? ("string" == typeof e ? e : e.source) : null;
    }
    function n(e) {
      return a("(", e, ")?");
    }
    function a(...n) {
      return n.map((n) => e(n)).join("");
    }
    function s(...n) {
      return "(" + n.map((n) => e(n)).join("|") + ")";
    }
    return function (e) {
      var t =
          "false synchronized int abstract float private char boolean var static null if const for true while long strictfp finally protected import native final void enum else break transient catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private module requires exports do",
        i = {
          className: "meta",
          begin: "@[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*",
          contains: [{ begin: /\(/, end: /\)/, contains: ["self"] }],
        },
        r = (e) => a("[", e, "]+([", e, "_]*[", e, "]+)?"),
        c = {
          className: "number",
          variants: [
            { begin: `\\b(0[bB]${r("01")})[lL]?` },
            { begin: `\\b(0${r("0-7")})[dDfFlL]?` },
            {
              begin: a(
                /\b0[xX]/,
                s(
                  a(r("a-fA-F0-9"), /\./, r("a-fA-F0-9")),
                  a(r("a-fA-F0-9"), /\.?/),
                  a(/\./, r("a-fA-F0-9"))
                ),
                /([pP][+-]?(\d+))?/,
                /[fFdDlL]?/
              ),
            },
            {
              begin: a(
                /\b/,
                s(a(/\d*\./, r("\\d")), r("\\d")),
                /[eE][+-]?[\d]+[dDfF]?/
              ),
            },
            { begin: a(/\b/, r(/\d/), n(/\.?/), n(r(/\d/)), /[dDfFlL]?/) },
          ],
          relevance: 0,
        };
      return {
        name: "Java",
        aliases: ["jsp"],
        keywords: t,
        illegal: /<\/|#/,
        contains: [
          e.COMMENT("/\\*\\*", "\\*/", {
            relevance: 0,
            contains: [
              { begin: /\w+@/, relevance: 0 },
              { className: "doctag", begin: "@[A-Za-z]+" },
            ],
          }),
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          {
            className: "class",
            beginKeywords: "class interface",
            end: /[{;=]/,
            excludeEnd: !0,
            keywords: "class interface",
            illegal: /[:"\[\]]/,
            contains: [
              { beginKeywords: "extends implements" },
              e.UNDERSCORE_TITLE_MODE,
            ],
          },
          { beginKeywords: "new throw return else", relevance: 0 },
          {
            className: "function",
            begin:
              "([À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*(<[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*(\\s*,\\s*[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*)*>)?\\s+)+" +
              e.UNDERSCORE_IDENT_RE +
              "\\s*\\(",
            returnBegin: !0,
            end: /[{;=]/,
            excludeEnd: !0,
            keywords: t,
            contains: [
              {
                begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
                returnBegin: !0,
                relevance: 0,
                contains: [e.UNDERSCORE_TITLE_MODE],
              },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: t,
                relevance: 0,
                contains: [
                  i,
                  e.APOS_STRING_MODE,
                  e.QUOTE_STRING_MODE,
                  e.C_NUMBER_MODE,
                  e.C_BLOCK_COMMENT_MODE,
                ],
              },
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          c,
          i,
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "python-repl",
  (function () {
    "use strict";
    return function (n) {
      return {
        aliases: ["pycon"],
        contains: [
          {
            className: "meta",
            starts: { end: / |$/, starts: { end: "$", subLanguage: "python" } },
            variants: [
              { begin: /^>>>(?=[ ]|$)/ },
              { begin: /^\.\.\.(?=[ ]|$)/ },
            ],
          },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "objectivec",
  (function () {
    "use strict";
    return function (e) {
      var n = /[a-zA-Z@][a-zA-Z0-9_]*/,
        _ = {
          $pattern: n,
          keyword: "@interface @class @protocol @implementation",
        };
      return {
        name: "Objective-C",
        aliases: ["mm", "objc", "obj-c"],
        keywords: {
          $pattern: n,
          keyword:
            "int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign readwrite self @synchronized id typeof nonatomic super unichar IBOutlet IBAction strong weak copy in out inout bycopy byref oneway __strong __weak __block __autoreleasing @private @protected @public @try @property @end @throw @catch @finally @autoreleasepool @synthesize @dynamic @selector @optional @required @encode @package @import @defs @compatibility_alias __bridge __bridge_transfer __bridge_retained __bridge_retain __covariant __contravariant __kindof _Nonnull _Nullable _Null_unspecified __FUNCTION__ __PRETTY_FUNCTION__ __attribute__ getter setter retain unsafe_unretained nonnull nullable null_unspecified null_resettable class instancetype NS_DESIGNATED_INITIALIZER NS_UNAVAILABLE NS_REQUIRES_SUPER NS_RETURNS_INNER_POINTER NS_INLINE NS_AVAILABLE NS_DEPRECATED NS_ENUM NS_OPTIONS NS_SWIFT_UNAVAILABLE NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_REFINED_FOR_SWIFT NS_SWIFT_NAME NS_SWIFT_NOTHROW NS_DURING NS_HANDLER NS_ENDHANDLER NS_VALUERETURN NS_VOIDRETURN",
          literal: "false true FALSE TRUE nil YES NO NULL",
          built_in:
            "BOOL dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once",
        },
        illegal: "</",
        contains: [
          {
            className: "built_in",
            begin:
              "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+",
          },
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          e.C_NUMBER_MODE,
          e.QUOTE_STRING_MODE,
          e.APOS_STRING_MODE,
          {
            className: "string",
            variants: [
              {
                begin: '@"',
                end: '"',
                illegal: "\\n",
                contains: [e.BACKSLASH_ESCAPE],
              },
            ],
          },
          {
            className: "meta",
            begin: /#\s*[a-z]+\b/,
            end: /$/,
            keywords: {
              "meta-keyword":
                "if else elif endif define undef warning error line pragma ifdef ifndef include",
            },
            contains: [
              { begin: /\\\n/, relevance: 0 },
              e.inherit(e.QUOTE_STRING_MODE, { className: "meta-string" }),
              {
                className: "meta-string",
                begin: /<.*?>/,
                end: /$/,
                illegal: "\\n",
              },
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          {
            className: "class",
            begin: "(" + _.keyword.split(" ").join("|") + ")\\b",
            end: "({|$)",
            excludeEnd: !0,
            keywords: _,
            contains: [e.UNDERSCORE_TITLE_MODE],
          },
          { begin: "\\." + e.UNDERSCORE_IDENT_RE, relevance: 0 },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "diff",
  (function () {
    "use strict";
    return function (e) {
      return {
        name: "Diff",
        aliases: ["patch"],
        contains: [
          {
            className: "meta",
            relevance: 10,
            variants: [
              { begin: /^@@ +\-\d+,\d+ +\+\d+,\d+ +@@$/ },
              { begin: /^\*\*\* +\d+,\d+ +\*\*\*\*$/ },
              { begin: /^\-\-\- +\d+,\d+ +\-\-\-\-$/ },
            ],
          },
          {
            className: "comment",
            variants: [
              { begin: /Index: /, end: /$/ },
              { begin: /={3,}/, end: /$/ },
              { begin: /^\-{3}/, end: /$/ },
              { begin: /^\*{3} /, end: /$/ },
              { begin: /^\+{3}/, end: /$/ },
              { begin: /^\*{15}$/ },
            ],
          },
          { className: "addition", begin: "^\\+", end: "$" },
          { className: "deletion", begin: "^\\-", end: "$" },
          { className: "addition", begin: "^\\!", end: "$" },
        ],
      };
    };
  })()
);
hljs.registerLanguage(
  "coffeescript",
  (function () {
    "use strict";
    const e = [
        "as",
        "in",
        "of",
        "if",
        "for",
        "while",
        "finally",
        "var",
        "new",
        "function",
        "do",
        "return",
        "void",
        "else",
        "break",
        "catch",
        "instanceof",
        "with",
        "throw",
        "case",
        "default",
        "try",
        "switch",
        "continue",
        "typeof",
        "delete",
        "let",
        "yield",
        "const",
        "class",
        "debugger",
        "async",
        "await",
        "static",
        "import",
        "from",
        "export",
        "extends",
      ],
      n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
      a = [].concat(
        [
          "setInterval",
          "setTimeout",
          "clearInterval",
          "clearTimeout",
          "require",
          "exports",
          "eval",
          "isFinite",
          "isNaN",
          "parseFloat",
          "parseInt",
          "decodeURI",
          "decodeURIComponent",
          "encodeURI",
          "encodeURIComponent",
          "escape",
          "unescape",
        ],
        [
          "arguments",
          "this",
          "super",
          "console",
          "window",
          "document",
          "localStorage",
          "module",
          "global",
        ],
        [
          "Intl",
          "DataView",
          "Number",
          "Math",
          "Date",
          "String",
          "RegExp",
          "Object",
          "Function",
          "Boolean",
          "Error",
          "Symbol",
          "Set",
          "Map",
          "WeakSet",
          "WeakMap",
          "Proxy",
          "Reflect",
          "JSON",
          "Promise",
          "Float64Array",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "Uint16Array",
          "Uint32Array",
          "Float32Array",
          "Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "ArrayBuffer",
        ],
        [
          "EvalError",
          "InternalError",
          "RangeError",
          "ReferenceError",
          "SyntaxError",
          "TypeError",
          "URIError",
        ]
      );
    return function (r) {
      var t = {
          keyword: e
            .concat([
              "then",
              "unless",
              "until",
              "loop",
              "by",
              "when",
              "and",
              "or",
              "is",
              "isnt",
              "not",
            ])
            .filter(
              ((e) => (n) => !e.includes(n))([
                "var",
                "const",
                "let",
                "function",
                "static",
              ])
            )
            .join(" "),
          literal: n.concat(["yes", "no", "on", "off"]).join(" "),
          built_in: a.concat(["npm", "print"]).join(" "),
        },
        i = "[A-Za-z$_][0-9A-Za-z$_]*",
        s = { className: "subst", begin: /#\{/, end: /}/, keywords: t },
        o = [
          r.BINARY_NUMBER_MODE,
          r.inherit(r.C_NUMBER_MODE, {
            starts: { end: "(\\s*/)?", relevance: 0 },
          }),
          {
            className: "string",
            variants: [
              { begin: /'''/, end: /'''/, contains: [r.BACKSLASH_ESCAPE] },
              { begin: /'/, end: /'/, contains: [r.BACKSLASH_ESCAPE] },
              { begin: /"""/, end: /"""/, contains: [r.BACKSLASH_ESCAPE, s] },
              { begin: /"/, end: /"/, contains: [r.BACKSLASH_ESCAPE, s] },
            ],
          },
          {
            className: "regexp",
            variants: [
              { begin: "///", end: "///", contains: [s, r.HASH_COMMENT_MODE] },
              { begin: "//[gim]{0,3}(?=\\W)", relevance: 0 },
              { begin: /\/(?![ *]).*?(?![\\]).\/[gim]{0,3}(?=\W)/ },
            ],
          },
          { begin: "@" + i },
          {
            subLanguage: "javascript",
            excludeBegin: !0,
            excludeEnd: !0,
            variants: [
              { begin: "```", end: "```" },
              { begin: "`", end: "`" },
            ],
          },
        ];
      s.contains = o;
      var c = r.inherit(r.TITLE_MODE, { begin: i }),
        l = {
          className: "params",
          begin: "\\([^\\(]",
          returnBegin: !0,
          contains: [
            {
              begin: /\(/,
              end: /\)/,
              keywords: t,
              contains: ["self"].concat(o),
            },
          ],
        };
      return {
        name: "CoffeeScript",
        aliases: ["coffee", "cson", "iced"],
        keywords: t,
        illegal: /\/\*/,
        contains: o.concat([
          r.COMMENT("###", "###"),
          r.HASH_COMMENT_MODE,
          {
            className: "function",
            begin: "^\\s*" + i + "\\s*=\\s*(\\(.*\\))?\\s*\\B[-=]>",
            end: "[-=]>",
            returnBegin: !0,
            contains: [c, l],
          },
          {
            begin: /[:\(,=]\s*/,
            relevance: 0,
            contains: [
              {
                className: "function",
                begin: "(\\(.*\\))?\\s*\\B[-=]>",
                end: "[-=]>",
                returnBegin: !0,
                contains: [l],
              },
            ],
          },
          {
            className: "class",
            beginKeywords: "class",
            end: "$",
            illegal: /[:="\[\]]/,
            contains: [
              {
                beginKeywords: "extends",
                endsWithParent: !0,
                illegal: /[:="\[\]]/,
                contains: [c],
              },
              c,
            ],
          },
          {
            begin: i + ":",
            end: ":",
            returnBegin: !0,
            returnEnd: !0,
            relevance: 0,
          },
        ]),
      };
    };
  })()
);
