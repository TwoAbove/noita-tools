/* eslint-disable */
/* tslint:disable */

var create_noita_random = (() => {
  var _scriptDir = import.meta.url;

  return async function (moduleArg = {}) {
    var g = moduleArg,
      aa,
      ca;
    g.ready = new Promise((a, b) => {
      aa = a;
      ca = b;
    });
    var da = Object.assign({}, g),
      ea = "object" == typeof window,
      p = "function" == typeof importScripts,
      fa =
        "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
      t = "",
      ha,
      ia;
    if (fa) {
      const { createRequire: a } = await import("module");
      var require = a(import.meta.url),
        fs = require("fs"),
        ja = require("path");
      p ? (t = ja.dirname(t) + "/") : (t = require("url").fileURLToPath(new URL("./", import.meta.url)));
      ha = (b, c) => {
        b = ka(b) ? new URL(b) : ja.normalize(b);
        return fs.readFileSync(b, c ? void 0 : "utf8");
      };
      ia = b => {
        b = ha(b, !0);
        b.buffer || (b = new Uint8Array(b));
        return b;
      };
      process.argv.slice(2);
      g.inspect = () => "[Emscripten Module object]";
    } else if (ea || p)
      p
        ? (t = self.location.href)
        : "undefined" != typeof document && document.currentScript && (t = document.currentScript.src),
        _scriptDir && (t = _scriptDir),
        0 !== t.indexOf("blob:") ? (t = t.substr(0, t.replace(/[?#].*/, "").lastIndexOf("/") + 1)) : (t = ""),
        (ha = a => {
          var b = new XMLHttpRequest();
          b.open("GET", a, !1);
          b.send(null);
          return b.responseText;
        }),
        p &&
          (ia = a => {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          });
    var la = g.print || console.log.bind(console),
      u = g.printErr || console.error.bind(console);
    Object.assign(g, da);
    da = null;
    var x;
    g.wasmBinary && (x = g.wasmBinary);
    "object" != typeof WebAssembly && y("no native wasm support detected");
    var ma,
      na = !1,
      oa,
      z,
      C,
      pa,
      D,
      E,
      qa,
      ra;
    function sa() {
      var a = ma.buffer;
      g.HEAP8 = oa = new Int8Array(a);
      g.HEAP16 = C = new Int16Array(a);
      g.HEAPU8 = z = new Uint8Array(a);
      g.HEAPU16 = pa = new Uint16Array(a);
      g.HEAP32 = D = new Int32Array(a);
      g.HEAPU32 = E = new Uint32Array(a);
      g.HEAPF32 = qa = new Float32Array(a);
      g.HEAPF64 = ra = new Float64Array(a);
    }
    var ta = [],
      ua = [],
      va = [];
    function wa() {
      var a = g.preRun.shift();
      ta.unshift(a);
    }
    var F = 0,
      xa = null,
      G = null;
    function y(a) {
      if (g.onAbort) g.onAbort(a);
      a = "Aborted(" + a + ")";
      u(a);
      na = !0;
      a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
      ca(a);
      throw a;
    }
    var ya = a => a.startsWith("data:application/octet-stream;base64,"),
      ka = a => a.startsWith("file://"),
      H;
    if (g.locateFile) {
      if (((H = "noita_random-base.wasm"), !ya(H))) {
        var za = H;
        H = g.locateFile ? g.locateFile(za, t) : t + za;
      }
    } else H = new URL("noita_random-base.wasm", import.meta.url).href;
    function Aa(a) {
      if (a == H && x) return new Uint8Array(x);
      if (ia) return ia(a);
      throw "both async and sync fetching of the wasm failed";
    }
    function Ba(a) {
      return x || (!ea && !p) || "function" != typeof fetch
        ? Promise.resolve().then(() => Aa(a))
        : fetch(a, { credentials: "same-origin" })
            .then(b => {
              if (!b.ok) throw "failed to load wasm binary file at '" + a + "'";
              return b.arrayBuffer();
            })
            .catch(() => Aa(a));
    }
    function Ca(a, b, c) {
      return Ba(a)
        .then(d => WebAssembly.instantiate(d, b))
        .then(d => d)
        .then(c, d => {
          u(`failed to asynchronously prepare wasm: ${d}`);
          y(d);
        });
    }
    function Da(a, b) {
      var c = H;
      return x || "function" != typeof WebAssembly.instantiateStreaming || ya(c) || fa || "function" != typeof fetch
        ? Ca(c, a, b)
        : fetch(c, { credentials: "same-origin" }).then(d =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              u(`wasm streaming compile failed: ${e}`);
              u("falling back to ArrayBuffer instantiation");
              return Ca(c, a, b);
            }),
          );
    }
    var Ea = a => {
        for (; 0 < a.length; ) a.shift()(g);
      },
      Fa = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
      I = (a, b, c) => {
        var d = b + c;
        for (c = b; a[c] && !(c >= d); ) ++c;
        if (16 < c - b && a.buffer && Fa) return Fa.decode(a.subarray(b, c));
        for (d = ""; b < c; ) {
          var e = a[b++];
          if (e & 128) {
            var f = a[b++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode(((e & 31) << 6) | f);
            else {
              var k = a[b++] & 63;
              e =
                224 == (e & 240)
                  ? ((e & 15) << 12) | (f << 6) | k
                  : ((e & 7) << 18) | (f << 12) | (k << 6) | (a[b++] & 63);
              65536 > e
                ? (d += String.fromCharCode(e))
                : ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))));
            }
          } else d += String.fromCharCode(e);
        }
        return d;
      };
    function Ga(a) {
      this.O = a - 24;
      this.pa = function (b) {
        E[(this.O + 4) >> 2] = b;
      };
      this.ia = function (b) {
        E[(this.O + 8) >> 2] = b;
      };
      this.da = function (b, c) {
        this.ha();
        this.pa(b);
        this.ia(c);
      };
      this.ha = function () {
        E[(this.O + 16) >> 2] = 0;
      };
    }
    var Ha = 0,
      Ia = 0,
      Ja,
      J = a => {
        for (var b = ""; z[a]; ) b += Ja[z[a++]];
        return b;
      },
      M = {},
      N = {},
      Ka = {},
      O,
      La = a => {
        throw new O(a);
      },
      P,
      R = (a, b, c) => {
        function d(h) {
          h = c(h);
          if (h.length !== a.length) throw new P("Mismatched type converter count");
          for (var l = 0; l < a.length; ++l) Q(a[l], h[l]);
        }
        a.forEach(function (h) {
          Ka[h] = b;
        });
        var e = Array(b.length),
          f = [],
          k = 0;
        b.forEach((h, l) => {
          N.hasOwnProperty(h)
            ? (e[l] = N[h])
            : (f.push(h),
              M.hasOwnProperty(h) || (M[h] = []),
              M[h].push(() => {
                e[l] = N[h];
                ++k;
                k === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      };
    function Ma(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new O(`type "${d}" must have a positive integer typeid pointer`);
      if (N.hasOwnProperty(a)) {
        if (c.ua) return;
        throw new O(`Cannot register type '${d}' twice`);
      }
      N[a] = b;
      delete Ka[a];
      M.hasOwnProperty(a) && ((b = M[a]), delete M[a], b.forEach(e => e()));
    }
    function Q(a, b, c = {}) {
      if (!("argPackAdvance" in b)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
      Ma(a, b, c);
    }
    var Na = a => {
        throw new O(a.L.P.N.name + " instance already deleted");
      },
      Oa = !1,
      Pa = () => {},
      Qa = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.S) return null;
        a = Qa(a, b, c.S);
        return null === a ? null : c.ra(a);
      },
      Ra = {},
      S = [],
      Sa = () => {
        for (; S.length; ) {
          var a = S.pop();
          a.L.$ = !1;
          a["delete"]();
        }
      },
      T,
      U = {},
      Ta = (a, b) => {
        if (void 0 === b) throw new O("ptr should not be undefined");
        for (; a.S; ) (b = a.ba(b)), (a = a.S);
        return U[b];
      },
      Va = (a, b) => {
        if (!b.P || !b.O) throw new P("makeClassHandle requires ptr and ptrType");
        if (!!b.U !== !!b.R) throw new P("Both smartPtrType and smartPtr must be specified");
        b.count = { value: 1 };
        return Ua(Object.create(a, { L: { value: b } }));
      },
      Ua = a => {
        if ("undefined" === typeof FinalizationRegistry) return (Ua = b => b), a;
        Oa = new FinalizationRegistry(b => {
          b = b.L;
          --b.count.value;
          0 === b.count.value && (b.R ? b.U.X(b.R) : b.P.N.X(b.O));
        });
        Ua = b => {
          var c = b.L;
          c.R && Oa.register(b, { L: c }, b);
          return b;
        };
        Pa = b => {
          Oa.unregister(b);
        };
        return Ua(a);
      };
    function Wa() {}
    var Xa = a => {
      if (void 0 === a) return "_unknown";
      a = a.replace(/[^a-zA-Z0-9_]/g, "$");
      var b = a.charCodeAt(0);
      return 48 <= b && 57 >= b ? `_${a}` : a;
    };
    function Ya(a, b) {
      a = Xa(a);
      return {
        [a]: function () {
          return b.apply(this, arguments);
        },
      }[a];
    }
    var Za = (a, b, c) => {
        if (void 0 === a[b].T) {
          var d = a[b];
          a[b] = function () {
            if (!a[b].T.hasOwnProperty(arguments.length))
              throw new O(
                `Function '${c}' called with an invalid number of arguments (${arguments.length}) - expects one of (${a[b].T})!`,
              );
            return a[b].T[arguments.length].apply(this, arguments);
          };
          a[b].T = [];
          a[b].T[d.ea] = d;
        }
      },
      $a = (a, b, c) => {
        if (g.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== g[a].T && void 0 !== g[a].T[c]))
            throw new O(`Cannot register public name '${a}' twice`);
          Za(g, a, a);
          if (g.hasOwnProperty(c))
            throw new O(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          g[a].T[c] = b;
        } else (g[a] = b), void 0 !== c && (g[a].Ba = c);
      };
    function ab(a, b, c, d, e, f, k, h) {
      this.name = a;
      this.constructor = b;
      this.Y = c;
      this.X = d;
      this.S = e;
      this.sa = f;
      this.ba = k;
      this.ra = h;
      this.xa = [];
    }
    var bb = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.ba) throw new O(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.ba(a);
        b = b.S;
      }
      return a;
    };
    function cb(a, b) {
      if (null === b) {
        if (this.ja) throw new O(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.L) throw new O(`Cannot pass "${db(b)}" as a ${this.name}`);
      if (!b.L.O) throw new O(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return bb(b.L.O, b.L.P.N, this.N);
    }
    function eb(a, b) {
      if (null === b) {
        if (this.ja) throw new O(`null is not a valid ${this.name}`);
        if (this.ga) {
          var c = this.ya();
          null !== a && a.push(this.X, c);
          return c;
        }
        return 0;
      }
      if (!b.L) throw new O(`Cannot pass "${db(b)}" as a ${this.name}`);
      if (!b.L.O) throw new O(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.fa && b.L.P.fa)
        throw new O(
          `Cannot convert argument of type ${b.L.U ? b.L.U.name : b.L.P.name} to parameter type ${this.name}`,
        );
      c = bb(b.L.O, b.L.P.N, this.N);
      if (this.ga) {
        if (void 0 === b.L.R) throw new O("Passing raw pointer to smart pointer is illegal");
        switch (this.Aa) {
          case 0:
            if (b.L.U === this) c = b.L.R;
            else
              throw new O(
                `Cannot convert argument of type ${b.L.U ? b.L.U.name : b.L.P.name} to parameter type ${this.name}`,
              );
            break;
          case 1:
            c = b.L.R;
            break;
          case 2:
            if (b.L.U === this) c = b.L.R;
            else {
              var d = b.clone();
              c = this.za(
                c,
                fb(() => d["delete"]()),
              );
              null !== a && a.push(this.X, c);
            }
            break;
          default:
            throw new O("Unsupporting sharing policy");
        }
      }
      return c;
    }
    function gb(a, b) {
      if (null === b) {
        if (this.ja) throw new O(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.L) throw new O(`Cannot pass "${db(b)}" as a ${this.name}`);
      if (!b.L.O) throw new O(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.L.P.fa) throw new O(`Cannot convert argument of type ${b.L.P.name} to parameter type ${this.name}`);
      return bb(b.L.O, b.L.P.N, this.N);
    }
    function hb(a) {
      return this.fromWireType(E[a >> 2]);
    }
    function ib(a, b, c, d, e, f, k, h, l, n, m) {
      this.name = a;
      this.N = b;
      this.ja = c;
      this.fa = d;
      this.ga = e;
      this.wa = f;
      this.Aa = k;
      this.na = h;
      this.ya = l;
      this.za = n;
      this.X = m;
      e || void 0 !== b.S ? (this.toWireType = eb) : ((this.toWireType = d ? cb : gb), (this.W = null));
    }
    var jb = (a, b, c) => {
        if (!g.hasOwnProperty(a)) throw new P("Replacing nonexistant public symbol");
        void 0 !== g[a].T && void 0 !== c ? (g[a].T[c] = b) : ((g[a] = b), (g[a].ea = c));
      },
      kb = [],
      lb,
      mb = a => {
        var b = kb[a];
        b || (a >= kb.length && (kb.length = a + 1), (kb[a] = b = lb.get(a)));
        return b;
      },
      nb = (a, b) => {
        var c = [];
        return function () {
          c.length = 0;
          Object.assign(c, arguments);
          if (a.includes("j")) {
            var d = g["dynCall_" + a];
            d = c && c.length ? d.apply(null, [b].concat(c)) : d.call(null, b);
          } else d = mb(b).apply(null, c);
          return d;
        };
      },
      V = (a, b) => {
        a = J(a);
        var c = a.includes("j") ? nb(a, b) : mb(b);
        if ("function" != typeof c) throw new O(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      ob,
      qb = a => {
        a = pb(a);
        var b = J(a);
        W(a);
        return b;
      },
      X = (a, b) => {
        function c(f) {
          e[f] || N[f] || (Ka[f] ? Ka[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new ob(`${a}: ` + d.map(qb).join([", "]));
      },
      rb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(E[(b + 4 * d) >> 2]);
        return c;
      },
      sb = a => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function tb(a) {
      var b = Function;
      if (!(b instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof b} which is not a function`);
      var c = Ya(b.name || "unknownFunctionName", function () {});
      c.prototype = b.prototype;
      c = new c();
      a = b.apply(c, a);
      return a instanceof Object ? a : c;
    }
    function ub(a, b, c, d, e, f) {
      var k = b.length;
      if (2 > k) throw new O("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== b[1] && null !== c,
        l = !1;
      for (c = 1; c < b.length; ++c)
        if (null !== b[c] && void 0 === b[c].W) {
          l = !0;
          break;
        }
      var n = "void" !== b[0].name,
        m = "",
        q = "";
      for (c = 0; c < k - 2; ++c)
        (m += (0 !== c ? ", " : "") + "arg" + c), (q += (0 !== c ? ", " : "") + "arg" + c + "Wired");
      a = `\n        return function ${Xa(a)}(${m}) {\n        if (arguments.length !== ${
        k - 2
      }) {\n          throwBindingError('function ${a} called with ' + arguments.length + ' arguments, expected ${
        k - 2
      }');\n        }`;
      l && (a += "var destructors = [];\n");
      var r = l ? "destructors" : "null";
      m = "throwBindingError invoker fn runDestructors retType classParam".split(" ");
      d = [La, d, e, sb, b[0], b[1]];
      h && (a += "var thisWired = classParam.toWireType(" + r + ", this);\n");
      for (c = 0; c < k - 2; ++c)
        (a +=
          "var arg" + c + "Wired = argType" + c + ".toWireType(" + r + ", arg" + c + "); // " + b[c + 2].name + "\n"),
          m.push("argType" + c),
          d.push(b[c + 2]);
      h && (q = "thisWired" + (0 < q.length ? ", " : "") + q);
      a += (n || f ? "var rv = " : "") + "invoker(fn" + (0 < q.length ? ", " : "") + q + ");\n";
      if (l) a += "runDestructors(destructors);\n";
      else
        for (c = h ? 1 : 2; c < b.length; ++c)
          (f = 1 === c ? "thisWired" : "arg" + (c - 2) + "Wired"),
            null !== b[c].W &&
              ((a += f + "_dtor(" + f + "); // " + b[c].name + "\n"), m.push(f + "_dtor"), d.push(b[c].W));
      n && (a += "var ret = retType.fromWireType(rv);\nreturn ret;\n");
      m.push(a + "}\n");
      return tb(m).apply(null, d);
    }
    var vb = a => {
        a = a.trim();
        const b = a.indexOf("(");
        return -1 !== b
          ? (")" == a[a.length - 1] || y("Parentheses for argument names should match."), a.substr(0, b))
          : a;
      },
      wb = (a, b, c) => {
        if (!(a instanceof Object)) throw new O(`${c} with invalid "this": ${a}`);
        if (!(a instanceof b.N.constructor)) throw new O(`${c} incompatible with "this" of type ${a.constructor.name}`);
        if (!a.L.O) throw new O(`cannot call emscripten binding method ${c} on deleted object`);
        return bb(a.L.O, a.L.P.N, b.N);
      };
    function xb() {
      this.V = [void 0];
      this.ma = [];
    }
    var Y = new xb(),
      zb = a => {
        a >= Y.da && 0 === --Y.get(a).oa && Y.ia(a);
      },
      Ab = a => {
        if (!a) throw new O("Cannot use deleted val. handle = " + a);
        return Y.get(a).value;
      },
      fb = a => {
        switch (a) {
          case void 0:
            return 1;
          case null:
            return 2;
          case !0:
            return 3;
          case !1:
            return 4;
          default:
            return Y.ha({ oa: 1, value: a });
        }
      };
    function Bb(a) {
      return this.fromWireType(D[a >> 2]);
    }
    for (
      var db = a => {
          if (null === a) return "null";
          var b = typeof a;
          return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a;
        },
        Cb = (a, b) => {
          switch (b) {
            case 4:
              return function (c) {
                return this.fromWireType(qa[c >> 2]);
              };
            case 8:
              return function (c) {
                return this.fromWireType(ra[c >> 3]);
              };
            default:
              throw new TypeError(`invalid float width (${b}): ${a}`);
          }
        },
        Db = (a, b, c) => {
          switch (b) {
            case 1:
              return c ? d => oa[d >> 0] : d => z[d >> 0];
            case 2:
              return c ? d => C[d >> 1] : d => pa[d >> 1];
            case 4:
              return c ? d => D[d >> 2] : d => E[d >> 2];
            default:
              throw new TypeError(`invalid integer width (${b}): ${a}`);
          }
        },
        Eb = (a, b, c) => {
          var d = z;
          if (0 < c) {
            c = b + c - 1;
            for (var e = 0; e < a.length; ++e) {
              var f = a.charCodeAt(e);
              if (55296 <= f && 57343 >= f) {
                var k = a.charCodeAt(++e);
                f = (65536 + ((f & 1023) << 10)) | (k & 1023);
              }
              if (127 >= f) {
                if (b >= c) break;
                d[b++] = f;
              } else {
                if (2047 >= f) {
                  if (b + 1 >= c) break;
                  d[b++] = 192 | (f >> 6);
                } else {
                  if (65535 >= f) {
                    if (b + 2 >= c) break;
                    d[b++] = 224 | (f >> 12);
                  } else {
                    if (b + 3 >= c) break;
                    d[b++] = 240 | (f >> 18);
                    d[b++] = 128 | ((f >> 12) & 63);
                  }
                  d[b++] = 128 | ((f >> 6) & 63);
                }
                d[b++] = 128 | (f & 63);
              }
            }
            d[b] = 0;
          }
        },
        Fb = a => {
          for (var b = 0, c = 0; c < a.length; ++c) {
            var d = a.charCodeAt(c);
            127 >= d ? b++ : 2047 >= d ? (b += 2) : 55296 <= d && 57343 >= d ? ((b += 4), ++c) : (b += 3);
          }
          return b;
        },
        Gb = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0,
        Hb = (a, b) => {
          var c = a >> 1;
          for (var d = c + b / 2; !(c >= d) && pa[c]; ) ++c;
          c <<= 1;
          if (32 < c - a && Gb) return Gb.decode(z.subarray(a, c));
          c = "";
          for (d = 0; !(d >= b / 2); ++d) {
            var e = C[(a + 2 * d) >> 1];
            if (0 == e) break;
            c += String.fromCharCode(e);
          }
          return c;
        },
        Ib = (a, b, c) => {
          void 0 === c && (c = 2147483647);
          if (2 > c) return 0;
          c -= 2;
          var d = b;
          c = c < 2 * a.length ? c / 2 : a.length;
          for (var e = 0; e < c; ++e) (C[b >> 1] = a.charCodeAt(e)), (b += 2);
          C[b >> 1] = 0;
          return b - d;
        },
        Jb = a => 2 * a.length,
        Kb = (a, b) => {
          for (var c = 0, d = ""; !(c >= b / 4); ) {
            var e = D[(a + 4 * c) >> 2];
            if (0 == e) break;
            ++c;
            65536 <= e
              ? ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
              : (d += String.fromCharCode(e));
          }
          return d;
        },
        Lb = (a, b, c) => {
          void 0 === c && (c = 2147483647);
          if (4 > c) return 0;
          var d = b;
          c = d + c - 4;
          for (var e = 0; e < a.length; ++e) {
            var f = a.charCodeAt(e);
            if (55296 <= f && 57343 >= f) {
              var k = a.charCodeAt(++e);
              f = (65536 + ((f & 1023) << 10)) | (k & 1023);
            }
            D[b >> 2] = f;
            b += 4;
            if (b + 4 > c) break;
          }
          D[b >> 2] = 0;
          return b - d;
        },
        Mb = a => {
          for (var b = 0, c = 0; c < a.length; ++c) {
            var d = a.charCodeAt(c);
            55296 <= d && 57343 >= d && ++c;
            b += 4;
          }
          return b;
        },
        Nb = {},
        Ob = [],
        Pb = a => {
          var b = Ob.length;
          Ob.push(a);
          return b;
        },
        Qb = (a, b) => {
          var c = N[a];
          if (void 0 === c) throw ((a = b + " has unknown type " + qb(a)), new O(a));
          return c;
        },
        Rb = (a, b) => {
          for (var c = Array(a), d = 0; d < a; ++d) c[d] = Qb(E[(b + 4 * d) >> 2], "parameter " + d);
          return c;
        },
        Sb = [null, [], []],
        Wb = (a, b, c, d) => {
          var e = {
            string: n => {
              var m = 0;
              if (null !== n && void 0 !== n && 0 !== n) {
                m = Fb(n) + 1;
                var q = Tb(m);
                Eb(n, q, m);
                m = q;
              }
              return m;
            },
            array: n => {
              var m = Tb(n.length);
              oa.set(n, m);
              return m;
            },
          };
          a = g["_" + a];
          var f = [],
            k = 0;
          if (d)
            for (var h = 0; h < d.length; h++) {
              var l = e[c[h]];
              l ? (0 === k && (k = Ub()), (f[h] = l(d[h]))) : (f[h] = d[h]);
            }
          c = a.apply(null, f);
          return (c = (function (n) {
            0 !== k && Vb(k);
            return "string" === b ? (n ? I(z, n) : "") : "boolean" === b ? !!n : n;
          })(c));
        },
        Xb = Array(256),
        Yb = 0;
      256 > Yb;
      ++Yb
    )
      Xb[Yb] = String.fromCharCode(Yb);
    Ja = Xb;
    O = g.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = "BindingError";
      }
    };
    P = g.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = "InternalError";
      }
    };
    Object.assign(Wa.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof Wa && a instanceof Wa)) return !1;
        var b = this.L.P.N,
          c = this.L.O;
        a.L = a.L;
        var d = a.L.P.N;
        for (a = a.L.O; b.S; ) (c = b.ba(c)), (b = b.S);
        for (; d.S; ) (a = d.ba(a)), (d = d.S);
        return b === d && c === a;
      },
      clone: function () {
        this.L.O || Na(this);
        if (this.L.aa) return (this.L.count.value += 1), this;
        var a = Ua,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.L;
        a = a(c.call(b, d, { L: { value: { count: e.count, $: e.$, aa: e.aa, O: e.O, P: e.P, R: e.R, U: e.U } } }));
        a.L.count.value += 1;
        a.L.$ = !1;
        return a;
      },
      ["delete"]() {
        this.L.O || Na(this);
        if (this.L.$ && !this.L.aa) throw new O("Object already scheduled for deletion");
        Pa(this);
        var a = this.L;
        --a.count.value;
        0 === a.count.value && (a.R ? a.U.X(a.R) : a.P.N.X(a.O));
        this.L.aa || ((this.L.R = void 0), (this.L.O = void 0));
      },
      isDeleted: function () {
        return !this.L.O;
      },
      deleteLater: function () {
        this.L.O || Na(this);
        if (this.L.$ && !this.L.aa) throw new O("Object already scheduled for deletion");
        S.push(this);
        1 === S.length && T && T(Sa);
        this.L.$ = !0;
        return this;
      },
    });
    g.getInheritedInstanceCount = () => Object.keys(U).length;
    g.getLiveInheritedInstances = () => {
      var a = [],
        b;
      for (b in U) U.hasOwnProperty(b) && a.push(U[b]);
      return a;
    };
    g.flushPendingDeletes = Sa;
    g.setDelayFunction = a => {
      T = a;
      S.length && T && T(Sa);
    };
    Object.assign(ib.prototype, {
      ta(a) {
        this.na && (a = this.na(a));
        return a;
      },
      la(a) {
        this.X && this.X(a);
      },
      argPackAdvance: 8,
      readValueFromPointer: hb,
      deleteObject: function (a) {
        if (null !== a) a["delete"]();
      },
      fromWireType: function (a) {
        function b() {
          return this.ga ? Va(this.N.Y, { P: this.wa, O: c, U: this, R: a }) : Va(this.N.Y, { P: this, O: a });
        }
        var c = this.ta(a);
        if (!c) return this.la(a), null;
        var d = Ta(this.N, c);
        if (void 0 !== d) {
          if (0 === d.L.count.value) return (d.L.O = c), (d.L.R = a), d.clone();
          d = d.clone();
          this.la(a);
          return d;
        }
        d = this.N.sa(c);
        d = Ra[d];
        if (!d) return b.call(this);
        d = this.fa ? d.qa : d.pointerType;
        var e = Qa(c, this.N, d.N);
        return null === e
          ? b.call(this)
          : this.ga
          ? Va(d.N.Y, { P: d, O: e, U: this, R: a })
          : Va(d.N.Y, { P: d, O: e });
      },
    });
    ob = g.UnboundTypeError = ((a, b) => {
      var c = Ya(b, function (d) {
        this.name = b;
        this.message = d;
        d = Error(d).stack;
        void 0 !== d && (this.stack = this.toString() + "\n" + d.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      c.prototype = Object.create(a.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message ? this.name : `${this.name}: ${this.message}`;
      };
      return c;
    })(Error, "UnboundTypeError");
    Object.assign(xb.prototype, {
      get(a) {
        return this.V[a];
      },
      has(a) {
        return void 0 !== this.V[a];
      },
      ha(a) {
        var b = this.ma.pop() || this.V.length;
        this.V[b] = a;
        return b;
      },
      ia(a) {
        this.V[a] = void 0;
        this.ma.push(a);
      },
    });
    Y.V.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 });
    Y.da = Y.V.length;
    g.count_emval_handles = () => {
      for (var a = 0, b = Y.da; b < Y.V.length; ++b) void 0 !== Y.V[b] && ++a;
      return a;
    };
    var $b = {
        a: (a, b, c, d) => {
          y(
            `Assertion failed: ${a ? I(z, a) : ""}, at: ` +
              [b ? (b ? I(z, b) : "") : "unknown filename", c, d ? (d ? I(z, d) : "") : "unknown function"],
          );
        },
        h: (a, b, c) => {
          new Ga(a).da(b, c);
          Ha = a;
          Ia++;
          throw Ha;
        },
        u: () => {},
        y: (a, b, c, d) => {
          b = J(b);
          Q(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            argPackAdvance: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(z[e]);
            },
            W: null,
          });
        },
        j: (a, b, c, d, e, f, k, h, l, n, m, q, r) => {
          m = J(m);
          f = V(e, f);
          h && (h = V(k, h));
          n && (n = V(l, n));
          r = V(q, r);
          var v = Xa(m);
          $a(v, function () {
            X(`Cannot construct ${m} due to unbound types`, [d]);
          });
          R([a, b, c], d ? [d] : [], function (w) {
            w = w[0];
            if (d) {
              var A = w.N;
              var K = A.Y;
            } else K = Wa.prototype;
            w = Ya(v, function () {
              if (Object.getPrototypeOf(this) !== L) throw new O("Use 'new' to construct " + m);
              if (void 0 === B.Z) throw new O(m + " has no accessible constructor");
              var yb = B.Z[arguments.length];
              if (void 0 === yb)
                throw new O(
                  `Tried to invoke ctor of ${m} with invalid number of parameters (${
                    arguments.length
                  }) - expected (${Object.keys(B.Z).toString()}) parameters instead!`,
                );
              return yb.apply(this, arguments);
            });
            var L = Object.create(K, { constructor: { value: w } });
            w.prototype = L;
            var B = new ab(m, w, L, r, A, f, h, n);
            B.S && (void 0 === B.S.ka && (B.S.ka = []), B.S.ka.push(B));
            A = new ib(m, B, !0, !1, !1);
            K = new ib(m + "*", B, !1, !1, !1);
            var ba = new ib(m + " const*", B, !1, !0, !1);
            Ra[a] = { pointerType: K, qa: ba };
            jb(v, w);
            return [A, K, ba];
          });
        },
        i: (a, b, c, d, e, f) => {
          var k = rb(b, c);
          e = V(d, e);
          R([], [a], function (h) {
            h = h[0];
            var l = `constructor ${h.name}`;
            void 0 === h.N.Z && (h.N.Z = []);
            if (void 0 !== h.N.Z[b - 1])
              throw new O(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  h.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            h.N.Z[b - 1] = () => {
              X(`Cannot construct ${h.name} due to unbound types`, k);
            };
            R([], k, n => {
              n.splice(1, 0, null);
              h.N.Z[b - 1] = ub(l, n, null, e, f);
              return [];
            });
            return [];
          });
        },
        d: (a, b, c, d, e, f, k, h, l) => {
          var n = rb(c, d);
          b = J(b);
          b = vb(b);
          f = V(e, f);
          R([], [a], function (m) {
            function q() {
              X(`Cannot call ${r} due to unbound types`, n);
            }
            m = m[0];
            var r = `${m.name}.${b}`;
            b.startsWith("@@") && (b = Symbol[b.substring(2)]);
            h && m.N.xa.push(b);
            var v = m.N.Y,
              w = v[b];
            void 0 === w || (void 0 === w.T && w.className !== m.name && w.ea === c - 2)
              ? ((q.ea = c - 2), (q.className = m.name), (v[b] = q))
              : (Za(v, b, r), (v[b].T[c - 2] = q));
            R([], n, function (A) {
              A = ub(r, A, m, f, k, l);
              void 0 === v[b].T ? ((A.ea = c - 2), (v[b] = A)) : (v[b].T[c - 2] = A);
              return [];
            });
            return [];
          });
        },
        f: (a, b, c, d, e, f, k, h, l, n) => {
          b = J(b);
          e = V(d, e);
          R([], [a], function (m) {
            m = m[0];
            var q = `${m.name}.${b}`,
              r = {
                get() {
                  X(`Cannot access ${q} due to unbound types`, [c, k]);
                },
                enumerable: !0,
                configurable: !0,
              };
            r.set = l
              ? () => X(`Cannot access ${q} due to unbound types`, [c, k])
              : () => {
                  throw new O(q + " is a read-only property");
                };
            Object.defineProperty(m.N.Y, b, r);
            R([], l ? [c, k] : [c], function (v) {
              var w = v[0],
                A = {
                  get() {
                    var L = wb(this, m, q + " getter");
                    return w.fromWireType(e(f, L));
                  },
                  enumerable: !0,
                };
              if (l) {
                l = V(h, l);
                var K = v[1];
                A.set = function (L) {
                  var B = wb(this, m, q + " setter"),
                    ba = [];
                  l(n, B, K.toWireType(ba, L));
                  sb(ba);
                };
              }
              Object.defineProperty(m.N.Y, b, A);
              return [];
            });
            return [];
          });
        },
        x: (a, b) => {
          b = J(b);
          Q(a, {
            name: b,
            fromWireType: c => {
              var d = Ab(c);
              zb(c);
              return d;
            },
            toWireType: (c, d) => fb(d),
            argPackAdvance: 8,
            readValueFromPointer: Bb,
            W: null,
          });
        },
        r: (a, b, c) => {
          b = J(b);
          Q(a, {
            name: b,
            fromWireType: d => d,
            toWireType: (d, e) => e,
            argPackAdvance: 8,
            readValueFromPointer: Cb(b, c),
            W: null,
          });
        },
        b: (a, b, c, d, e, f, k) => {
          var h = rb(b, c);
          a = J(a);
          a = vb(a);
          e = V(d, e);
          $a(
            a,
            function () {
              X(`Cannot call ${a} due to unbound types`, h);
            },
            b - 1,
          );
          R([], h, function (l) {
            l = [l[0], null].concat(l.slice(1));
            jb(a, ub(a, l, null, e, f, k), b - 1);
            return [];
          });
        },
        e: (a, b, c, d, e) => {
          b = J(b);
          -1 === e && (e = 4294967295);
          e = h => h;
          if (0 === d) {
            var f = 32 - 8 * c;
            e = h => (h << f) >>> f;
          }
          var k = b.includes("unsigned")
            ? function (h, l) {
                return l >>> 0;
              }
            : function (h, l) {
                return l;
              };
          Q(a, {
            name: b,
            fromWireType: e,
            toWireType: k,
            argPackAdvance: 8,
            readValueFromPointer: Db(b, c, 0 !== d),
            W: null,
          });
        },
        c: (a, b, c) => {
          function d(f) {
            return new e(oa.buffer, E[(f + 4) >> 2], E[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = J(c);
          Q(a, { name: c, fromWireType: d, argPackAdvance: 8, readValueFromPointer: d }, { ua: !0 });
        },
        q: (a, b) => {
          b = J(b);
          var c = "std::string" === b;
          Q(a, {
            name: b,
            fromWireType: function (d) {
              var e = E[d >> 2],
                f = d + 4;
              if (c)
                for (var k = f, h = 0; h <= e; ++h) {
                  var l = f + h;
                  if (h == e || 0 == z[l]) {
                    k = k ? I(z, k, l - k) : "";
                    if (void 0 === n) var n = k;
                    else (n += String.fromCharCode(0)), (n += k);
                    k = l + 1;
                  }
                }
              else {
                n = Array(e);
                for (h = 0; h < e; ++h) n[h] = String.fromCharCode(z[f + h]);
                n = n.join("");
              }
              W(d);
              return n;
            },
            toWireType: function (d, e) {
              e instanceof ArrayBuffer && (e = new Uint8Array(e));
              var f = "string" == typeof e;
              if (!(f || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array))
                throw new O("Cannot pass non-string to std::string");
              var k = c && f ? Fb(e) : e.length;
              var h = Zb(4 + k + 1),
                l = h + 4;
              E[h >> 2] = k;
              if (c && f) Eb(e, l, k + 1);
              else if (f)
                for (f = 0; f < k; ++f) {
                  var n = e.charCodeAt(f);
                  if (255 < n) throw (W(l), new O("String has UTF-16 code units that do not fit in 8 bits"));
                  z[l + f] = n;
                }
              else for (f = 0; f < k; ++f) z[l + f] = e[f];
              null !== d && d.push(W, h);
              return h;
            },
            argPackAdvance: 8,
            readValueFromPointer: hb,
            W(d) {
              W(d);
            },
          });
        },
        k: (a, b, c) => {
          c = J(c);
          if (2 === b) {
            var d = Hb;
            var e = Ib;
            var f = Jb;
            var k = () => pa;
            var h = 1;
          } else 4 === b && ((d = Kb), (e = Lb), (f = Mb), (k = () => E), (h = 2));
          Q(a, {
            name: c,
            fromWireType: l => {
              for (var n = E[l >> 2], m = k(), q, r = l + 4, v = 0; v <= n; ++v) {
                var w = l + 4 + v * b;
                if (v == n || 0 == m[w >> h])
                  (r = d(r, w - r)), void 0 === q ? (q = r) : ((q += String.fromCharCode(0)), (q += r)), (r = w + b);
              }
              W(l);
              return q;
            },
            toWireType: (l, n) => {
              if ("string" != typeof n) throw new O(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(n),
                q = Zb(4 + m + b);
              E[q >> 2] = m >> h;
              e(n, q + 4, m + b);
              null !== l && l.push(W, q);
              return q;
            },
            argPackAdvance: 8,
            readValueFromPointer: Bb,
            W(l) {
              W(l);
            },
          });
        },
        z: (a, b) => {
          b = J(b);
          Q(a, { va: !0, name: b, argPackAdvance: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        m: (a, b, c, d, e) => {
          a = Ob[a];
          b = Ab(b);
          var f = Nb[c];
          c = void 0 === f ? J(c) : f;
          f = [];
          a = a(b, c, f, e);
          f.length && (E[d >> 2] = fb(f));
          return a;
        },
        g: zb,
        n: (a, b) => {
          b = Rb(a, b);
          var c = b.shift();
          a--;
          for (var d = ["retType"], e = [c], f = "", k = 0; k < a; ++k)
            (f += (0 !== k ? ", " : "") + "arg" + k), d.push("argType" + k), e.push(b[k]);
          k = c.name + "_$" + b.map(n => n.name).join("_") + "$";
          var h = "return function " + Xa("methodCaller_" + k) + "(handle, name, destructors, args) {\n",
            l = 0;
          for (k = 0; k < a; ++k)
            (h += "    var arg" + k + " = argType" + k + ".readValueFromPointer(args" + (l ? "+" + l : "") + ");\n"),
              (l += b[k].argPackAdvance);
          h += "    var rv = handle[name](" + f + ");\n";
          for (k = 0; k < a; ++k) b[k].deleteObject && (h += "    argType" + k + ".deleteObject(arg" + k + ");\n");
          c.va || (h += "    return retType.toWireType(destructors, rv);\n");
          d.push(h + "};\n");
          a = tb(d).apply(null, e);
          return Pb(a);
        },
        s: a => {
          4 < a && (Y.get(a).oa += 1);
        },
        l: a => {
          var b = Ab(a);
          sb(b);
          zb(a);
        },
        t: (a, b) => {
          a = Qb(a, "_emval_take_value");
          a = a.readValueFromPointer(b);
          return fb(a);
        },
        o: () => {
          y("");
        },
        w: (a, b, c) => z.copyWithin(a, b, b + c),
        v: a => {
          var b = z.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, a + 100663296);
            var e = Math;
            d = Math.max(a, d);
            a: {
              e =
                (e.min.call(e, 2147483648, d + ((65536 - (d % 65536)) % 65536)) - ma.buffer.byteLength + 65535) / 65536;
              try {
                ma.grow(e);
                sa();
                var f = 1;
                break a;
              } catch (k) {}
              f = void 0;
            }
            if (f) return !0;
          }
          return !1;
        },
        p: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var k = E[b >> 2],
              h = E[(b + 4) >> 2];
            b += 8;
            for (var l = 0; l < h; l++) {
              var n = z[k + l],
                m = Sb[a];
              0 === n || 10 === n ? ((1 === a ? la : u)(I(m, 0)), (m.length = 0)) : m.push(n);
            }
            e += h;
          }
          E[d >> 2] = e;
          return 0;
        },
      },
      Z = (function () {
        function a(c) {
          Z = c.exports;
          ma = Z.A;
          sa();
          lb = Z.F;
          ua.unshift(Z.B);
          F--;
          g.monitorRunDependencies && g.monitorRunDependencies(F);
          0 == F && (null !== xa && (clearInterval(xa), (xa = null)), G && ((c = G), (G = null), c()));
          return Z;
        }
        var b = { a: $b };
        F++;
        g.monitorRunDependencies && g.monitorRunDependencies(F);
        if (g.instantiateWasm)
          try {
            return g.instantiateWasm(b, a);
          } catch (c) {
            u(`Module.instantiateWasm callback failed with error: ${c}`), ca(c);
          }
        Da(b, function (c) {
          a(c.instance);
        }).catch(ca);
        return {};
      })(),
      W = (g._free = a => (W = g._free = Z.C)(a)),
      Zb = (g._malloc = a => (Zb = g._malloc = Z.D)(a));
    g._generate_path_map = (a, b, c, d, e, f) => (g._generate_path_map = Z.E)(a, b, c, d, e, f);
    var pb = a => (pb = Z.G)(a);
    g.__embind_initialize_bindings = () => (g.__embind_initialize_bindings = Z.H)();
    var Ub = () => (Ub = Z.I)(),
      Vb = a => (Vb = Z.J)(a),
      Tb = a => (Tb = Z.K)(a);
    g.dynCall_jiji = (a, b, c, d, e) => (g.dynCall_jiji = Z.M)(a, b, c, d, e);
    g.cwrap = (a, b, c, d) => {
      var e = !c || c.every(f => "number" === f || "boolean" === f);
      return "string" !== b && e && !d
        ? g["_" + a]
        : function () {
            return Wb(a, b, c, arguments);
          };
    };
    var ac;
    G = function bc() {
      ac || cc();
      ac || (G = bc);
    };
    function cc() {
      function a() {
        if (!ac && ((ac = !0), (g.calledRun = !0), !na)) {
          Ea(ua);
          aa(g);
          if (g.onRuntimeInitialized) g.onRuntimeInitialized();
          if (g.postRun)
            for ("function" == typeof g.postRun && (g.postRun = [g.postRun]); g.postRun.length; ) {
              var b = g.postRun.shift();
              va.unshift(b);
            }
          Ea(va);
        }
      }
      if (!(0 < F)) {
        if (g.preRun) for ("function" == typeof g.preRun && (g.preRun = [g.preRun]); g.preRun.length; ) wa();
        Ea(ta);
        0 < F ||
          (g.setStatus
            ? (g.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  g.setStatus("");
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    if (g.preInit)
      for ("function" == typeof g.preInit && (g.preInit = [g.preInit]); 0 < g.preInit.length; ) g.preInit.pop()();
    cc();

    return moduleArg.ready;
  };
})();
export default create_noita_random;
