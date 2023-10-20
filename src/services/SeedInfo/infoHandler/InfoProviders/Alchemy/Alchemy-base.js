/* eslint-disable */
/* tslint:disable */

var create_Alchemy = (() => {
  var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return function (moduleArg = {}) {
    var e = moduleArg,
      aa,
      t;
    e.ready = new Promise((a, b) => {
      aa = a;
      t = b;
    });
    var ba = Object.assign({}, e),
      ca = "object" == typeof window,
      u = "function" == typeof importScripts,
      da =
        "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
      v = "",
      w,
      y;
    if (da) {
      var fs = require("fs"),
        ea = require("path");
      v = u ? ea.dirname(v) + "/" : __dirname + "/";
      w = (a, b) => {
        a = a.startsWith("file://") ? new URL(a) : ea.normalize(a);
        return fs.readFileSync(a, b ? void 0 : "utf8");
      };
      y = a => {
        a = w(a, !0);
        a.buffer || (a = new Uint8Array(a));
        return a;
      };
      process.argv.slice(2);
      e.inspect = () => "[Emscripten Module object]";
    } else if (ca || u)
      u
        ? (v = self.location.href)
        : "undefined" != typeof document && document.currentScript && (v = document.currentScript.src),
        _scriptDir && (v = _scriptDir),
        0 !== v.indexOf("blob:") ? (v = v.substr(0, v.replace(/[?#].*/, "").lastIndexOf("/") + 1)) : (v = ""),
        (w = a => {
          var b = new XMLHttpRequest();
          b.open("GET", a, !1);
          b.send(null);
          return b.responseText;
        }),
        u &&
          (y = a => {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          });
    e.print || console.log.bind(console);
    var z = e.printErr || console.error.bind(console);
    Object.assign(e, ba);
    ba = null;
    var B;
    e.wasmBinary && (B = e.wasmBinary);
    var noExitRuntime = e.noExitRuntime || !0;
    "object" != typeof WebAssembly && C("no native wasm support detected");
    var D,
      fa = !1,
      ha,
      E,
      G,
      H,
      I,
      J,
      ia,
      ja;
    function ka() {
      var a = D.buffer;
      e.HEAP8 = ha = new Int8Array(a);
      e.HEAP16 = G = new Int16Array(a);
      e.HEAPU8 = E = new Uint8Array(a);
      e.HEAPU16 = H = new Uint16Array(a);
      e.HEAP32 = I = new Int32Array(a);
      e.HEAPU32 = J = new Uint32Array(a);
      e.HEAPF32 = ia = new Float32Array(a);
      e.HEAPF64 = ja = new Float64Array(a);
    }
    var la = [],
      ma = [],
      na = [];
    function oa() {
      var a = e.preRun.shift();
      la.unshift(a);
    }
    var L = 0,
      pa = null,
      M = null;
    function C(a) {
      if (e.onAbort) e.onAbort(a);
      a = "Aborted(" + a + ")";
      z(a);
      fa = !0;
      a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
      t(a);
      throw a;
    }
    function qa(a) {
      return a.startsWith("data:application/octet-stream;base64,");
    }
    var N;
    N = "Alchemy-base.wasm";
    if (!qa(N)) {
      var ra = N;
      N = e.locateFile ? e.locateFile(ra, v) : v + ra;
    }
    function sa(a) {
      if (a == N && B) return new Uint8Array(B);
      if (y) return y(a);
      throw "both async and sync fetching of the wasm failed";
    }
    function ta(a) {
      return B || (!ca && !u) || "function" != typeof fetch
        ? Promise.resolve().then(() => sa(a))
        : fetch(a, { credentials: "same-origin" })
            .then(b => {
              if (!b.ok) throw "failed to load wasm binary file at '" + a + "'";
              return b.arrayBuffer();
            })
            .catch(() => sa(a));
    }
    function ua(a, b, c) {
      return ta(a)
        .then(d => WebAssembly.instantiate(d, b))
        .then(d => d)
        .then(c, d => {
          z(`failed to asynchronously prepare wasm: ${d}`);
          C(d);
        });
    }
    function va(a, b) {
      var c = N;
      return B || "function" != typeof WebAssembly.instantiateStreaming || qa(c) || da || "function" != typeof fetch
        ? ua(c, a, b)
        : fetch(c, { credentials: "same-origin" }).then(d =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (f) {
              z(`wasm streaming compile failed: ${f}`);
              z("falling back to ArrayBuffer instantiation");
              return ua(c, a, b);
            })
          );
    }
    var wa = a => {
      for (; 0 < a.length; ) a.shift()(e);
    };
    function xa(a) {
      this.C = a - 24;
      this.I = function (b) {
        J[(this.C + 4) >> 2] = b;
      };
      this.H = function (b) {
        J[(this.C + 8) >> 2] = b;
      };
      this.D = function (b, c) {
        this.F();
        this.I(b);
        this.H(c);
      };
      this.F = function () {
        J[(this.C + 16) >> 2] = 0;
      };
    }
    var ya = 0,
      za = 0,
      Aa,
      O = a => {
        for (var b = ""; E[a]; ) b += Aa[E[a++]];
        return b;
      },
      P = {},
      Q = {},
      R = {},
      S,
      Ba = a => {
        throw new S(a);
      },
      Ca,
      Da = (a, b) => {
        function c(l) {
          l = b(l);
          if (l.length !== d.length) throw new Ca("Mismatched type converter count");
          for (var k = 0; k < d.length; ++k) T(d[k], l[k]);
        }
        var d = [];
        d.forEach(function (l) {
          R[l] = a;
        });
        var f = Array(a.length),
          g = [],
          h = 0;
        a.forEach((l, k) => {
          Q.hasOwnProperty(l)
            ? (f[k] = Q[l])
            : (g.push(l),
              P.hasOwnProperty(l) || (P[l] = []),
              P[l].push(() => {
                f[k] = Q[l];
                ++h;
                h === g.length && c(f);
              }));
        });
        0 === g.length && c(f);
      };
    function Ea(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new S(`type "${d}" must have a positive integer typeid pointer`);
      if (Q.hasOwnProperty(a)) {
        if (c.K) return;
        throw new S(`Cannot register type '${d}' twice`);
      }
      Q[a] = b;
      delete R[a];
      P.hasOwnProperty(a) && ((b = P[a]), delete P[a], b.forEach(f => f()));
    }
    function T(a, b, c = {}) {
      if (!("argPackAdvance" in b)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
      Ea(a, b, c);
    }
    function Fa() {
      this.A = [void 0];
      this.G = [];
    }
    var U = new Fa(),
      Ga = a => {
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
            return U.D({ L: 1, value: a });
        }
      };
    function Ha(a) {
      return this.fromWireType(I[a >> 2]);
    }
    var Ia = (a, b) => {
        switch (b) {
          case 4:
            return function (c) {
              return this.fromWireType(ia[c >> 2]);
            };
          case 8:
            return function (c) {
              return this.fromWireType(ja[c >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${b}): ${a}`);
        }
      },
      La = a => {
        if (void 0 === a) return "_unknown";
        a = a.replace(/[^a-zA-Z0-9_]/g, "$");
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      },
      Ma = a => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function Na(a, b) {
      a = La(a);
      return {
        [a]: function () {
          return b.apply(this, arguments);
        },
      }[a];
    }
    function Oa(a) {
      var b = Function;
      if (!(b instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof b} which is not a function`);
      var c = Na(b.name || "unknownFunctionName", function () {});
      c.prototype = b.prototype;
      c = new c();
      a = b.apply(c, a);
      return a instanceof Object ? a : c;
    }
    var Pa = (a, b) => {
        if (void 0 === e[a].v) {
          var c = e[a];
          e[a] = function () {
            if (!e[a].v.hasOwnProperty(arguments.length))
              throw new S(
                `Function '${b}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[a].v})!`
              );
            return e[a].v[arguments.length].apply(this, arguments);
          };
          e[a].v = [];
          e[a].v[c.J] = c;
        }
      },
      Qa = (a, b, c) => {
        if (e.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== e[a].v && void 0 !== e[a].v[c]))
            throw new S(`Cannot register public name '${a}' twice`);
          Pa(a, a);
          if (e.hasOwnProperty(c))
            throw new S(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          e[a].v[c] = b;
        } else (e[a] = b), void 0 !== c && (e[a].N = c);
      },
      Ra = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(J[(b + 4 * d) >> 2]);
        return c;
      },
      V = [],
      Sa,
      Ta = a => {
        var b = V[a];
        b || (a >= V.length && (V.length = a + 1), (V[a] = b = Sa.get(a)));
        return b;
      },
      Ua = (a, b) => {
        var c = [];
        return function () {
          c.length = 0;
          Object.assign(c, arguments);
          if (a.includes("j")) {
            var d = e["dynCall_" + a];
            d = c && c.length ? d.apply(null, [b].concat(c)) : d.call(null, b);
          } else d = Ta(b).apply(null, c);
          return d;
        };
      },
      Va = (a, b) => {
        a = O(a);
        var c = a.includes("j") ? Ua(a, b) : Ta(b);
        if ("function" != typeof c) throw new S(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      Wa,
      Ya = a => {
        a = Xa(a);
        var b = O(a);
        W(a);
        return b;
      },
      Za = (a, b) => {
        function c(g) {
          f[g] || Q[g] || (R[g] ? R[g].forEach(c) : (d.push(g), (f[g] = !0)));
        }
        var d = [],
          f = {};
        b.forEach(c);
        throw new Wa(`${a}: ` + d.map(Ya).join([", "]));
      },
      $a = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? d => ha[d >> 0] : d => E[d >> 0];
          case 2:
            return c ? d => G[d >> 1] : d => H[d >> 1];
          case 4:
            return c ? d => I[d >> 2] : d => J[d >> 2];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      };
    function ab(a) {
      return this.fromWireType(J[a >> 2]);
    }
    for (
      var bb = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
        cb = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0,
        db = (a, b) => {
          var c = a >> 1;
          for (var d = c + b / 2; !(c >= d) && H[c]; ) ++c;
          c <<= 1;
          if (32 < c - a && cb) return cb.decode(E.subarray(a, c));
          c = "";
          for (d = 0; !(d >= b / 2); ++d) {
            var f = G[(a + 2 * d) >> 1];
            if (0 == f) break;
            c += String.fromCharCode(f);
          }
          return c;
        },
        eb = (a, b, c) => {
          void 0 === c && (c = 2147483647);
          if (2 > c) return 0;
          c -= 2;
          var d = b;
          c = c < 2 * a.length ? c / 2 : a.length;
          for (var f = 0; f < c; ++f) (G[b >> 1] = a.charCodeAt(f)), (b += 2);
          G[b >> 1] = 0;
          return b - d;
        },
        fb = a => 2 * a.length,
        gb = (a, b) => {
          for (var c = 0, d = ""; !(c >= b / 4); ) {
            var f = I[(a + 4 * c) >> 2];
            if (0 == f) break;
            ++c;
            65536 <= f
              ? ((f -= 65536), (d += String.fromCharCode(55296 | (f >> 10), 56320 | (f & 1023))))
              : (d += String.fromCharCode(f));
          }
          return d;
        },
        hb = (a, b, c) => {
          void 0 === c && (c = 2147483647);
          if (4 > c) return 0;
          var d = b;
          c = d + c - 4;
          for (var f = 0; f < a.length; ++f) {
            var g = a.charCodeAt(f);
            if (55296 <= g && 57343 >= g) {
              var h = a.charCodeAt(++f);
              g = (65536 + ((g & 1023) << 10)) | (h & 1023);
            }
            I[b >> 2] = g;
            b += 4;
            if (b + 4 > c) break;
          }
          I[b >> 2] = 0;
          return b - d;
        },
        ib = a => {
          for (var b = 0, c = 0; c < a.length; ++c) {
            var d = a.charCodeAt(c);
            55296 <= d && 57343 >= d && ++c;
            b += 4;
          }
          return b;
        },
        jb = Array(256),
        X = 0;
      256 > X;
      ++X
    )
      jb[X] = String.fromCharCode(X);
    Aa = jb;
    S = e.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = "BindingError";
      }
    };
    Ca = e.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = "InternalError";
      }
    };
    Object.assign(Fa.prototype, {
      get(a) {
        return this.A[a];
      },
      has(a) {
        return void 0 !== this.A[a];
      },
      D(a) {
        var b = this.G.pop() || this.A.length;
        this.A[b] = a;
        return b;
      },
      F(a) {
        this.A[a] = void 0;
        this.G.push(a);
      },
    });
    U.A.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 });
    U.C = U.A.length;
    e.count_emval_handles = () => {
      for (var a = 0, b = U.C; b < U.A.length; ++b) void 0 !== U.A[b] && ++a;
      return a;
    };
    Wa = e.UnboundTypeError = ((a, b) => {
      var c = Na(b, function (d) {
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
    var lb = {
        g: (a, b, c) => {
          new xa(a).D(b, c);
          ya = a;
          za++;
          throw ya;
        },
        k: () => {},
        i: (a, b, c, d) => {
          b = O(b);
          T(a, {
            name: b,
            fromWireType: function (f) {
              return !!f;
            },
            toWireType: function (f, g) {
              return g ? c : d;
            },
            argPackAdvance: 8,
            readValueFromPointer: function (f) {
              return this.fromWireType(E[f]);
            },
            B: null,
          });
        },
        h: (a, b) => {
          b = O(b);
          T(a, {
            name: b,
            fromWireType: c => {
              if (!c) throw new S("Cannot use deleted val. handle = " + c);
              var d = U.get(c).value;
              c >= U.C && 0 === --U.get(c).L && U.F(c);
              return d;
            },
            toWireType: (c, d) => Ga(d),
            argPackAdvance: 8,
            readValueFromPointer: Ha,
            B: null,
          });
        },
        e: (a, b, c) => {
          b = O(b);
          T(a, {
            name: b,
            fromWireType: d => d,
            toWireType: (d, f) => f,
            argPackAdvance: 8,
            readValueFromPointer: Ia(b, c),
            B: null,
          });
        },
        f: (a, b, c, d, f, g, h) => {
          var l = Ra(b, c);
          a = O(a);
          f = Va(d, f);
          Qa(
            a,
            function () {
              Za(`Cannot call ${a} due to unbound types`, l);
            },
            b - 1
          );
          Da(l, function (k) {
            var m = [k[0], null].concat(k.slice(1)),
              p = (k = a),
              r = f,
              q = m.length;
            if (2 > q) throw new S("argTypes array size mismatch! Must at least get return value and 'this' types!");
            for (var x = null !== m[1] && !1, A = !1, n = 1; n < m.length; ++n)
              if (null !== m[n] && void 0 === m[n].B) {
                A = !0;
                break;
              }
            var Ja = "void" !== m[0].name,
              F = "",
              K = "";
            for (n = 0; n < q - 2; ++n)
              (F += (0 !== n ? ", " : "") + "arg" + n), (K += (0 !== n ? ", " : "") + "arg" + n + "Wired");
            p = `\n        return function ${La(p)}(${F}) {\n        if (arguments.length !== ${
              q - 2
            }) {\n          throwBindingError('function ${p} called with ' + arguments.length + ' arguments, expected ${
              q - 2
            }');\n        }`;
            A && (p += "var destructors = [];\n");
            var Ka = A ? "destructors" : "null";
            F = "throwBindingError invoker fn runDestructors retType classParam".split(" ");
            r = [Ba, r, g, Ma, m[0], m[1]];
            x && (p += "var thisWired = classParam.toWireType(" + Ka + ", this);\n");
            for (n = 0; n < q - 2; ++n)
              (p +=
                "var arg" +
                n +
                "Wired = argType" +
                n +
                ".toWireType(" +
                Ka +
                ", arg" +
                n +
                "); // " +
                m[n + 2].name +
                "\n"),
                F.push("argType" + n),
                r.push(m[n + 2]);
            x && (K = "thisWired" + (0 < K.length ? ", " : "") + K);
            p += (Ja || h ? "var rv = " : "") + "invoker(fn" + (0 < K.length ? ", " : "") + K + ");\n";
            if (A) p += "runDestructors(destructors);\n";
            else
              for (n = x ? 1 : 2; n < m.length; ++n)
                (q = 1 === n ? "thisWired" : "arg" + (n - 2) + "Wired"),
                  null !== m[n].B &&
                    ((p += q + "_dtor(" + q + "); // " + m[n].name + "\n"), F.push(q + "_dtor"), r.push(m[n].B));
            Ja && (p += "var ret = retType.fromWireType(rv);\nreturn ret;\n");
            F.push(p + "}\n");
            m = Oa(F).apply(null, r);
            n = b - 1;
            if (!e.hasOwnProperty(k)) throw new Ca("Replacing nonexistant public symbol");
            void 0 !== e[k].v && void 0 !== n ? (e[k].v[n] = m) : ((e[k] = m), (e[k].J = n));
            return [];
          });
        },
        b: (a, b, c, d, f) => {
          b = O(b);
          -1 === f && (f = 4294967295);
          f = l => l;
          if (0 === d) {
            var g = 32 - 8 * c;
            f = l => (l << g) >>> g;
          }
          var h = b.includes("unsigned")
            ? function (l, k) {
                return k >>> 0;
              }
            : function (l, k) {
                return k;
              };
          T(a, {
            name: b,
            fromWireType: f,
            toWireType: h,
            argPackAdvance: 8,
            readValueFromPointer: $a(b, c, 0 !== d),
            B: null,
          });
        },
        a: (a, b, c) => {
          function d(g) {
            return new f(ha.buffer, J[(g + 4) >> 2], J[g >> 2]);
          }
          var f = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = O(c);
          T(a, { name: c, fromWireType: d, argPackAdvance: 8, readValueFromPointer: d }, { K: !0 });
        },
        d: (a, b) => {
          b = O(b);
          var c = "std::string" === b;
          T(a, {
            name: b,
            fromWireType: function (d) {
              var f = J[d >> 2],
                g = d + 4;
              if (c)
                for (var h = g, l = 0; l <= f; ++l) {
                  var k = g + l;
                  if (l == f || 0 == E[k]) {
                    if (h) {
                      var m = h;
                      var p = E,
                        r = m + (k - h);
                      for (h = m; p[h] && !(h >= r); ) ++h;
                      if (16 < h - m && p.buffer && bb) m = bb.decode(p.subarray(m, h));
                      else {
                        for (r = ""; m < h; ) {
                          var q = p[m++];
                          if (q & 128) {
                            var x = p[m++] & 63;
                            if (192 == (q & 224)) r += String.fromCharCode(((q & 31) << 6) | x);
                            else {
                              var A = p[m++] & 63;
                              q =
                                224 == (q & 240)
                                  ? ((q & 15) << 12) | (x << 6) | A
                                  : ((q & 7) << 18) | (x << 12) | (A << 6) | (p[m++] & 63);
                              65536 > q
                                ? (r += String.fromCharCode(q))
                                : ((q -= 65536), (r += String.fromCharCode(55296 | (q >> 10), 56320 | (q & 1023))));
                            }
                          } else r += String.fromCharCode(q);
                        }
                        m = r;
                      }
                    } else m = "";
                    if (void 0 === n) var n = m;
                    else (n += String.fromCharCode(0)), (n += m);
                    h = k + 1;
                  }
                }
              else {
                n = Array(f);
                for (l = 0; l < f; ++l) n[l] = String.fromCharCode(E[g + l]);
                n = n.join("");
              }
              W(d);
              return n;
            },
            toWireType: function (d, f) {
              f instanceof ArrayBuffer && (f = new Uint8Array(f));
              var g,
                h = "string" == typeof f;
              if (!(h || f instanceof Uint8Array || f instanceof Uint8ClampedArray || f instanceof Int8Array))
                throw new S("Cannot pass non-string to std::string");
              var l;
              if (c && h)
                for (g = l = 0; g < f.length; ++g) {
                  var k = f.charCodeAt(g);
                  127 >= k ? l++ : 2047 >= k ? (l += 2) : 55296 <= k && 57343 >= k ? ((l += 4), ++g) : (l += 3);
                }
              else l = f.length;
              g = l;
              l = kb(4 + g + 1);
              k = l + 4;
              J[l >> 2] = g;
              if (c && h) {
                if (((h = k), (k = g + 1), (g = E), 0 < k)) {
                  k = h + k - 1;
                  for (var m = 0; m < f.length; ++m) {
                    var p = f.charCodeAt(m);
                    if (55296 <= p && 57343 >= p) {
                      var r = f.charCodeAt(++m);
                      p = (65536 + ((p & 1023) << 10)) | (r & 1023);
                    }
                    if (127 >= p) {
                      if (h >= k) break;
                      g[h++] = p;
                    } else {
                      if (2047 >= p) {
                        if (h + 1 >= k) break;
                        g[h++] = 192 | (p >> 6);
                      } else {
                        if (65535 >= p) {
                          if (h + 2 >= k) break;
                          g[h++] = 224 | (p >> 12);
                        } else {
                          if (h + 3 >= k) break;
                          g[h++] = 240 | (p >> 18);
                          g[h++] = 128 | ((p >> 12) & 63);
                        }
                        g[h++] = 128 | ((p >> 6) & 63);
                      }
                      g[h++] = 128 | (p & 63);
                    }
                  }
                  g[h] = 0;
                }
              } else if (h)
                for (h = 0; h < g; ++h) {
                  m = f.charCodeAt(h);
                  if (255 < m) throw (W(k), new S("String has UTF-16 code units that do not fit in 8 bits"));
                  E[k + h] = m;
                }
              else for (h = 0; h < g; ++h) E[k + h] = f[h];
              null !== d && d.push(W, l);
              return l;
            },
            argPackAdvance: 8,
            readValueFromPointer: ab,
            B(d) {
              W(d);
            },
          });
        },
        c: (a, b, c) => {
          c = O(c);
          if (2 === b) {
            var d = db;
            var f = eb;
            var g = fb;
            var h = () => H;
            var l = 1;
          } else 4 === b && ((d = gb), (f = hb), (g = ib), (h = () => J), (l = 2));
          T(a, {
            name: c,
            fromWireType: k => {
              for (var m = J[k >> 2], p = h(), r, q = k + 4, x = 0; x <= m; ++x) {
                var A = k + 4 + x * b;
                if (x == m || 0 == p[A >> l])
                  (q = d(q, A - q)), void 0 === r ? (r = q) : ((r += String.fromCharCode(0)), (r += q)), (q = A + b);
              }
              W(k);
              return r;
            },
            toWireType: (k, m) => {
              if ("string" != typeof m) throw new S(`Cannot pass non-string to C++ string type ${c}`);
              var p = g(m),
                r = kb(4 + p + b);
              J[r >> 2] = p >> l;
              f(m, r + 4, p + b);
              null !== k && k.push(W, r);
              return r;
            },
            argPackAdvance: 8,
            readValueFromPointer: Ha,
            B(k) {
              W(k);
            },
          });
        },
        j: (a, b) => {
          b = O(b);
          T(a, { M: !0, name: b, argPackAdvance: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        l: () => {
          C("");
        },
        n: (a, b, c) => E.copyWithin(a, b, b + c),
        m: a => {
          var b = E.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, a + 100663296);
            var f = Math;
            d = Math.max(a, d);
            a: {
              f =
                (f.min.call(f, 2147483648, d + ((65536 - (d % 65536)) % 65536)) - D.buffer.byteLength + 65535) / 65536;
              try {
                D.grow(f);
                ka();
                var g = 1;
                break a;
              } catch (h) {}
              g = void 0;
            }
            if (g) return !0;
          }
          return !1;
        },
      },
      Y = (function () {
        function a(c) {
          Y = c.exports;
          D = Y.o;
          ka();
          Sa = Y.r;
          ma.unshift(Y.p);
          L--;
          e.monitorRunDependencies && e.monitorRunDependencies(L);
          0 == L && (null !== pa && (clearInterval(pa), (pa = null)), M && ((c = M), (M = null), c()));
          return Y;
        }
        var b = { a: lb };
        L++;
        e.monitorRunDependencies && e.monitorRunDependencies(L);
        if (e.instantiateWasm)
          try {
            return e.instantiateWasm(b, a);
          } catch (c) {
            z(`Module.instantiateWasm callback failed with error: ${c}`), t(c);
          }
        va(b, function (c) {
          a(c.instance);
        }).catch(t);
        return {};
      })(),
      kb = (e._malloc = a => (kb = e._malloc = Y.q)(a)),
      Xa = a => (Xa = Y.s)(a);
    e.__embind_initialize_bindings = () => (e.__embind_initialize_bindings = Y.t)();
    var W = (e._free = a => (W = e._free = Y.u)(a)),
      Z;
    M = function mb() {
      Z || nb();
      Z || (M = mb);
    };
    function nb() {
      function a() {
        if (!Z && ((Z = !0), (e.calledRun = !0), !fa)) {
          wa(ma);
          aa(e);
          if (e.onRuntimeInitialized) e.onRuntimeInitialized();
          if (e.postRun)
            for ("function" == typeof e.postRun && (e.postRun = [e.postRun]); e.postRun.length; ) {
              var b = e.postRun.shift();
              na.unshift(b);
            }
          wa(na);
        }
      }
      if (!(0 < L)) {
        if (e.preRun) for ("function" == typeof e.preRun && (e.preRun = [e.preRun]); e.preRun.length; ) oa();
        wa(la);
        0 < L ||
          (e.setStatus
            ? (e.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  e.setStatus("");
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    if (e.preInit)
      for ("function" == typeof e.preInit && (e.preInit = [e.preInit]); 0 < e.preInit.length; ) e.preInit.pop()();
    nb();

    return moduleArg.ready;
  };
})();
if (typeof exports === "object" && typeof module === "object") module.exports = create_Alchemy;
else if (typeof define === "function" && define["amd"]) define([], () => create_Alchemy);
